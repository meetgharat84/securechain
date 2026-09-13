import type { Finding, ReplayStep, ScanRecord } from '../types';

export const SHIELD_LOGO_URL = '/shield-logo.svg';
export const AVATAR_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxPnKJ7rZuSDTgyHT9WMl3LPOCnIps-zXV1WitFLLBRsSV3KYxBLCo_c4gV0KfZVmoHWtS5q43Trp5lBAms1uSsi_C0JPDM-pK1tct56tJcmqfc6QGfcTOFFfkS0D6ZKoL70uniVaa5j4oZxlezbs1Q6y1wLKYWkN4hR2LNhRciRLdU7IHW7R97tzVqZx00LgY4N0w_RtTyXCcoaSYO2LWZwfG-Snx57zp5FKBg8nZJB4kVutKnz137Q';
export const WIREFRAME_HERO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0DVNbO5_mbcHs1q-BsJgGNIS2KOfK3YWD49lifa-2Lj6TkngOHYLMCCU6nMTgXt3wAeIbMY-3CVVa3uY-Qr5-kFvZy2e6BcizSKbnZWQr2js3BIuaVakH3APDsBPvZAFBhYx8NP6fwQ1if9hu0de_1FTg_3Ef2Zb_KG6m1DDFnX-HGDdL4bCVPgwTph69_FAzhEnUj8wbQXOfU42jMAtPVFEESVPEYM75TPzY2-ugb101MJwc8grTuA';
export const TELEMETRY_BLOCK_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7Yehx76amftIXa2T7J4d3f5jsoyDI-v9r1BEALFnkPmBZz3SwYh3sZgDic3mQqiVxTAnKvgOkLt7CcGhWzdWUpnmLIbSADtnR1YKlgqy4h6tv1Io9N5Wg52cSAIMidLx2B-N_5zOyVm0_3a8hY6ZQQblXYSFGXNPd4NK11ZFP-VKBrkNM3M9ERzTSqt6y-Qzv-R04Szu4Erb89ei7ICep8RasJXx5nQ8V486L--NxBwRYPrLKOZIWQ';

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'f-1',
    findingNumber: 'FINDING #01',
    title: 'Reentrancy',
    severity: 'Critical',
    confidence: 'High',
    detector: 'reentrancy-external-call',
    functionName: 'withdraw()',
    lines: '14–21',
    startLine: 14,
    endLine: 21,
    swcId: 'SWC-107',
    cweId: 'CWE-841',
    description: 'An external call happens before the user\'s balance is updated. An attacker may call this function again before the balance becomes zero.',
    evidence: 'Target contract yields execution control via msg.sender.call{value: amount}("") at line 16 before deduction of balances[msg.sender] -= amount at line 18.',
    explanationDetails: {
      whatHappened: "An external call happens before the user's balance is updated.",
      whyItMatters: "An attacker may call this function again before the balance becomes zero.",
      attackerScenario: "This can allow the attacker to withdraw more funds than they deposited.",
      howFixWorks: "Implement the Checks-Effects-Interactions pattern (deduct user balance before call) or guard the withdrawal routine with an established reentrancy mutex (nonReentrant)."
    },
    preconditions: [
      'Recursive invocation: The caller recipient can define a fallback or receive routine re-triggering withdraw().',
      'Stale balance verification: The require statement reads the pre-withdrawal balance during nested frames.',
      'Total vault drain: Gas allowance via native call forwarding permits repeated execution until protocol balance reaches zero.'
    ],
    recommendation: 'Implement the Checks-Effects-Interactions pattern. Deduct user balance before firing the raw call transfer, or guard the withdrawal routine with an established reentrancy mutex (nonReentrant).'
  },
  {
    id: 'f-2',
    findingNumber: 'FINDING #02',
    title: 'Missing access control',
    severity: 'High',
    confidence: 'High',
    detector: 'missing-access-control',
    functionName: 'changeOwner()',
    lines: '25',
    startLine: 25,
    endLine: 27,
    swcId: 'SWC-105',
    cweId: 'CWE-284',
    description: 'The changeOwner() function can be called by anyone. An attacker may replace the contract owner and gain privileged control.',
    evidence: 'function changeOwner(address newOwner) external lacks caller authorization guard or onlyOwner modifier.',
    explanationDetails: {
      whatHappened: "The changeOwner() function can be called by anyone.",
      whyItMatters: "An attacker may replace the contract owner and gain privileged control.",
      attackerScenario: "An unauthorized caller can claim ownership and hijack protocol management routines.",
      howFixWorks: "Restrict this function to the current owner or an authorized role using an onlyOwner modifier."
    },
    preconditions: [
      'Arbitrary caller invocation: Any untrusted account can reassign the protocol recipient target.',
      'Immediate redirection: Next execution cycle forwards all administrative commands to unauthorized caller.'
    ],
    recommendation: 'Restrict this function to the current owner or an authorized role using an onlyOwner modifier or OpenZeppelin Ownable/AccessControl.'
  },
  {
    id: 'f-3',
    findingNumber: 'FINDING #03',
    title: 'Unchecked external call',
    severity: 'Medium',
    confidence: 'High',
    detector: 'unchecked-call-return',
    functionName: 'execute()',
    lines: '42',
    startLine: 30,
    endLine: 32,
    swcId: 'SWC-104',
    cweId: 'CWE-252',
    description: 'The contract does not check whether the external call succeeded. The transaction may continue even when the external operation fails.',
    evidence: 'target.call(data); invoked without checking returned boolean or reverting on failure.',
    explanationDetails: {
      whatHappened: "The contract does not check whether the external call succeeded.",
      whyItMatters: "The transaction may continue even when the external operation fails.",
      attackerScenario: "State transitions or balance assumptions could proceed silently despite downstream failure.",
      howFixWorks: "Check the returned success value and handle failure explicitly with require(success, 'Transfer failed')."
    },
    preconditions: [
      'Non-reverting execution: Downstream recipient may fail silently without stopping the parent execution frame.',
      'Desynchronized state: Protocol marks action completed despite sub-operation failing.'
    ],
    recommendation: 'Check the returned success value and handle failure explicitly: (bool success, ) = target.call(data); require(success, "Execution failed");'
  }
];

export const TREASURY_VAULT_SOURCE = `pragma solidity ^0.8.20;

contract VulnerableVault {
    mapping(address => uint256) public balances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= amount;
    }

    function changeOwner(address newOwner) external {
        owner = newOwner;
    }

    function execute(address target, bytes calldata data) external {
        target.call(data);
    }
}`;

export const REPLAY_STEPS: ReplayStep[] = [
  {
    step: 1,
    title: 'Environment Initialization & Storage Fork',
    description: 'Anvil snapshot instantiated with VulnerableVault balance of 50 ETH.',
    gas: '0',
    status: 'nominal'
  },
  {
    step: 2,
    title: 'Initial Vector Injection: withdraw(5 ETH)',
    description: 'Simulated adversary contract triggers transfer payload with 0.1 ETH deposit history.',
    gas: '42,109',
    status: 'nominal'
  },
  {
    step: 3,
    title: 'Storage Mutation & Balance Guard Assessment',
    description: 'balances[msg.sender] deducted before message call frame dispatch.',
    gas: '18,340',
    status: 'nominal'
  },
  {
    step: 4,
    title: 'Exploit Callback Trap Triggers',
    description: 'Adversary contract re-entry halted instantly via nonReentrant mutex lock.',
    gas: 'REVERT TRACE',
    status: 'revert'
  },
  {
    step: 5,
    title: 'Invariant Assertion Audit',
    description: 'All protocol solvency and authorization invariants remain immutable.',
    gas: 'Verified OK',
    status: 'passed'
  }
];

export const SCAN_HISTORY_DATA: ScanRecord[] = [
  {
    id: 'REP-84102-SEC',
    target: 'Treasury Protocols',
    contract: 'VulnerableVault.sol',
    score: 42,
    findingsCount: { critical: 1, high: 1, medium: 1, low: 0 },
    commit: 'a9f14b2',
    date: '2 minutes ago',
    status: 'Completed'
  },
  {
    id: 'REP-84091-SEC',
    target: 'Uniswap V4 Hook',
    contract: 'DynamicFeeHook.sol',
    score: 88,
    findingsCount: { critical: 0, high: 1, medium: 2, low: 1 },
    commit: 'b318d09',
    date: 'Yesterday, 18:32',
    status: 'Completed'
  },
  {
    id: 'REP-84045-SEC',
    target: 'Compound Fork',
    contract: 'ComptrollerV2.sol',
    score: 94,
    findingsCount: { critical: 0, high: 0, medium: 1, low: 2 },
    commit: 'f0923ce',
    date: '3 days ago',
    status: 'Completed'
  }
];
