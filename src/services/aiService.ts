import { z } from 'zod';
import type { SecurityFinding } from './securityEngine';
import { DEMO_PATCHED_VAULT_SOURCE } from './securityEngine';

// Zod schema for structured AI output as requested in the prompt
export const AIPatchResponseSchema = z.object({
  summary: z.string(),
  impact: z.string(),
  exploitScenario: z.string(),
  remediation: z.string(),
  patchedCode: z.string(),
  limitations: z.string(),
});

export type AIPatchResponse = z.infer<typeof AIPatchResponseSchema>;

export class AIService {
  private static apiKey: string = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY) ||
    '';

  public static isAIAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey !== 'MY_GEMINI_API_KEY' && this.apiKey.trim().length > 0);
  }

  /**
   * Generates beginner-friendly explanation and patch for a finding.
   * If AI API is unavailable or fails, returns exact deterministic fallback.
   */
  public static async generatePatchAndExplanation(
    finding: SecurityFinding,
    originalSource: string
  ): Promise<{ data: AIPatchResponse; isAIAssisted: boolean }> {
    // If Gemini API is available, invoke it
    if (this.isAIAvailable()) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: this.apiKey });
        const prompt = `
You are a senior Solidity security auditor. Provide a structured security remediation and explanation for:
Finding: ${finding.title} (${finding.detector})
Affected Function: ${finding.functionName}
Lines: ${finding.lines}
Contract Source:
\`\`\`solidity
${originalSource}
\`\`\`

Return a JSON object conforming strictly to this structure:
{
  "summary": "Simple beginner-friendly summary of the vulnerability",
  "impact": "Why this matters to the protocol and user funds",
  "exploitScenario": "Step-by-step description of how an attacker executes the exploit",
  "remediation": "Clear explanation of how the patch fixes the issue",
  "patchedCode": "Complete hardened Solidity contract code",
  "limitations": "Any assumptions or secondary considerations"
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        const validated = AIPatchResponseSchema.parse(parsed);
        return { data: validated, isAIAssisted: true };
      } catch (err) {
        console.warn('AI service call failed, falling back to deterministic remediation:', err);
      }
    }

    // Deterministic fallback matching exact prompt definitions
    return {
      data: this.getDeterministicFallback(finding, originalSource),
      isAIAssisted: false
    };
  }

  public static getDeterministicFallback(finding: SecurityFinding, _originalSource: string): AIPatchResponse {
    void _originalSource;
    if (finding.detector === 'reentrancy-external-call' || finding.title === 'Reentrancy') {
      return {
        summary: "An external call happens before the user's balance is updated. An attacker may call this function again before the balance becomes zero. This can allow the attacker to withdraw more funds than they deposited.",
        impact: "High risk of total liquidity drainage. Recursive contract invocation bypasses balance checks when execution transfer precedes storage finalization.",
        exploitScenario: "1. Attacker deploys malicious contract with fallback function.\n2. Attacker calls withdraw().\n3. Target sends ETH; attacker's fallback intercepts execution.\n4. Attacker re-invokes withdraw() before initial balance was deducted.",
        remediation: "Apply the Checks-Effects-Interactions (CEI) pattern by decrementing storage balance prior to external call, and guard the function with OpenZeppelin's ReentrancyGuard (nonReentrant modifier).",
        patchedCode: DEMO_PATCHED_VAULT_SOURCE,
        limitations: "Requires importing ReentrancyGuard or using atomic transient storage reentrancy mutex."
      };
    }

    if (finding.detector === 'missing-access-control' || finding.title === 'Missing access control') {
      return {
        summary: "The changeOwner() function can be called by anyone. An attacker may replace the contract owner and gain privileged control. Restrict this function to the current owner or an authorized role.",
        impact: "Complete protocol takeover. Any arbitrary caller can reassign ownership and take control of administrative commands.",
        exploitScenario: "1. Attacker monitors public transactions.\n2. Attacker invokes changeOwner(attackerAddress).\n3. Contract updates owner variable without checking msg.sender.\n4. Attacker now possesses full owner privileges.",
        remediation: "Add an onlyOwner modifier that enforces require(msg.sender == owner, 'Caller is not the owner').",
        patchedCode: DEMO_PATCHED_VAULT_SOURCE,
        limitations: "Ensure initial owner is appropriately initialized in constructor."
      };
    }

    // Unchecked external call
    return {
      summary: "The contract does not check whether the external call succeeded. The transaction may continue even when the external operation fails. Check the returned success value and handle failure explicitly.",
      impact: "Silent failure states where caller assumes execution passed when low-level call reverted downstream.",
      exploitScenario: "1. An invalid target or out-of-gas call occurs.\n2. target.call() returns (false, ...).\n3. Function ignores return boolean and finishes normally, leading to corrupt accounting.",
      remediation: "Capture the returned boolean value and explicitly assert success: (bool success, ) = target.call(data); require(success, 'Execution failed');",
      patchedCode: DEMO_PATCHED_VAULT_SOURCE,
      limitations: "Low-level calls should only be executed against trusted contracts."
    };
  }
}
