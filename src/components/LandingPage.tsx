import React from 'react';
import type { AppScreen } from '../types';
import { SHIELD_LOGO_URL, AVATAR_URL } from '../data/mockData';
import { SecureChainFrameAnimation } from './SecureChainFrameAnimation';
import { AuthService } from '../services/authService';

interface LandingPageProps {
  onNavigate: (screen: AppScreen, urlPath?: string) => void;
  onOpenNewScan: () => void;
  onSelectFindingForWorkbench?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenNewScan,
  onSelectFindingForWorkbench
}) => {
  return (
    <div className="bg-[#faf9f6] text-[#1b1c1a] min-h-screen flex flex-col font-sans">
      {/* Editorial Fixed Header */}
      <header className="fixed top-0 w-full z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e9e8e5]/80">
        <div className="h-20 max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between gap-space-md">
          {/* Brand Logo & Sub-Badges */}
          <div className="flex items-center gap-space-md">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-space-xs cursor-pointer text-left group"
            >
              <img
                alt="SecureChain AI Shield Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                src={SHIELD_LOGO_URL}
              />
              <span className="font-headline-sm text-headline-sm text-[#1b1c1a] tracking-tight">
                SecureChain AI
              </span>
            </button>

            <div className="hidden xl:flex items-center gap-space-2xs">
              <span className="inline-flex items-center px-space-xs py-space-2xs rounded-full bg-[#efeeeb] font-label-caps text-label-caps text-[#44474a] uppercase">
                Solidity Security
              </span>
              <span className="inline-flex items-center px-space-xs py-space-2xs rounded-full bg-[#efeeeb] font-label-caps text-label-caps text-[#37675d] uppercase">
                Verified Patching
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-space-lg">
            <button
              onClick={() => {
                const el = document.getElementById('lifecycle-pipeline');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="transition-colors text-[#1b1c1a] font-headline-sm cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('methodology')}
              className="font-body-base text-body-base text-[#44474a] hover:text-[#1b1c1a] transition-colors cursor-pointer"
            >
              Methodology
            </button>
            <button
              onClick={() => onNavigate('demo-gallery')}
              className="font-body-base text-body-base text-[#44474a] hover:text-[#1b1c1a] transition-colors cursor-pointer"
            >
              Demo Gallery
            </button>
            <button
              onClick={() => onNavigate('overview')}
              className="font-body-base text-body-base text-[#44474a] hover:text-[#1b1c1a] transition-colors cursor-pointer"
            >
              Audit Reports
            </button>
          </nav>

          {/* Header Action Strip */}
          <div className="flex items-center gap-space-sm">
            <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-[#baede0]/40 border border-[#37675d]/20">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#37675d] animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]/60"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]/40"></span>
              </div>
              <span className="font-code-sm text-code-sm text-[#1e4f46] font-medium">Analyzer Ready</span>
            </div>

            <button
              onClick={() => {
                if (AuthService.isAuthenticated()) {
                  onNavigate('overview', '/app');
                } else {
                  onNavigate('login', '/login');
                }
              }}
              className="px-space-md py-space-xs bg-[#000000] text-[#ffffff] rounded-lg font-headline-sm text-body-base hover:bg-[#191c1f] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Open Console
            </button>

            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#c5c6ca]"
              src={AVATAR_URL}
            />
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="w-full pt-20 bg-[#faf9f6] min-h-screen flex-1">
        <div className="flex flex-col w-full">
          {/* HERO SECTION */}
          <section className="relative w-full overflow-hidden bg-[#faf9f6]">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop pt-space-xl lg:pt-space-3xl pb-space-3xl lg:pb-space-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-space-2xl lg:gap-x-space-lg items-center relative">
                {/* Left Editorial Copy */}
                <div className="lg:col-span-6 z-10 space-y-space-md lg:space-y-space-lg">
                  {/* Hero Heading with Editorial Stagger */}
                  <div className="space-y-1">
                    <h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-[#1b1c1a] tracking-tight leading-[1.08]">
                      <span>Find the flaw.</span><br />
                      <span className="text-[#37675d] font-headline-lg lg:text-display-hero">Fix the contract.</span><br />
                      <span>Prove the patch.</span>
                    </h1>
                  </div>

                  {/* Restrained Analytical Description */}
                  <p className="font-body-lg text-body-base lg:text-body-lg text-[#44474a] max-w-xl leading-relaxed">
                    SecureChain AI detects Solidity vulnerabilities, explains the exploit path, proposes a patch, and verifies whether the risk was actually removed.
                  </p>

                  {/* Primary Actions */}
                  <div className="pt-space-xs flex flex-wrap items-center gap-space-sm">
                    <button
                      onClick={onOpenNewScan}
                      className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-[#000000] text-[#ffffff] hover:bg-[#191c1f] transition-all text-body-base font-headline-sm tracking-tight shadow-sm hover:shadow cursor-pointer active:scale-95"
                    >
                      <span>Analyze a Contract</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => {
                        const el = document.getElementById('demo-preview');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] transition-all text-body-base font-body-base shadow-2xs border border-[#e3e2df] cursor-pointer"
                    >
                      <span>Explore Demo Report</span>
                      <span className="material-symbols-outlined text-[16px] text-[#44474a]">arrow_downward</span>
                    </button>
                  </div>

                  {/* Micro Telemetry Metadata Bar */}
                  <div className="pt-space-lg flex items-center gap-space-md text-[#44474a]">
                    <div className="flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-[15px] text-[#37675d]">verified</span>
                      <span className="font-code-sm text-code-sm">Deterministic AST verification</span>
                    </div>
                    <span className="text-[#c5c6ca] font-code-sm">•</span>
                    <div className="flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-[15px] text-[#44474a]">commit</span>
                      <span className="font-code-sm text-code-sm">Solidity 0.8.x - 0.8.28</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: High-Key Analytical Sculpture Viewport */}
                <div className="lg:col-span-6 relative flex items-center justify-center min-h-[380px] lg:min-h-[520px]">
                  {/* High-Key Animation Viewport */}
                  <div className="relative w-full h-[400px] lg:h-[520px] flex items-center justify-center">
                    <SecureChainFrameAnimation
                      totalFrames={300}
                      fps={24}
                      className="w-full h-full"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FORENSIC PIPELINE: Detect -> Explain -> Patch -> Verify */}
          <section id="lifecycle-pipeline" className="w-full bg-[#f4f3f0] py-space-3xl lg:py-space-4xl border-y border-[#e9e8e5]">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop space-y-space-2xl">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="space-y-space-2xs max-w-xl">
                  <div className="flex items-center gap-space-xs font-label-caps text-label-caps uppercase tracking-widest text-[#37675d]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]"></span>
                    <span>Deterministic Lifecycle</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-[#1b1c1a] tracking-tight">
                    From Raw Opcode to Formally Verified Differential
                  </h2>
                </div>
                <p className="font-body-base text-body-base text-[#44474a] max-w-md leading-relaxed">
                  Unlike stochastic chat bots that generate syntactically plausible illusions, our analyzer works backwards from bytecode state invariance.
                </p>
              </div>

              {/* 4-Stage Architectural Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* CARD 1: DETECT */}
                <div className="bg-[#ffffff] rounded-xl p-space-lg flex flex-col justify-between space-y-space-lg shadow-xs border border-[#e9e8e5] hover:shadow-md transition-all">
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-[#ba1a1a] tracking-widest bg-[#ffdad6]/40 px-space-xs py-space-2xs rounded-full font-semibold">
                        Stage 01
                      </span>
                      <span className="font-code-sm text-code-sm text-[#75777a]">AST-TRACE</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Detect</h3>
                      <p className="font-body-sm text-body-sm text-[#44474a] leading-relaxed">
                        Syntactic analysis of control-flow graphs. Flags external calls preceding internal ledger updates.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#191c1f] p-space-sm rounded-lg space-y-1 text-[#828488] font-code-sm text-code-sm">
                    <div className="flex items-center justify-between text-[#e1e2e6]">
                      <span>Finding: SWC-107</span>
                      <span className="text-[#ba1a1a] font-medium">Critical</span>
                    </div>
                    <div className="text-[#c5c6ca] truncate font-mono">call.value(bal)("")</div>
                    <div className="text-[#ffdad6] font-code-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">warning</span>
                      <span>State mutated after call</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: EXPLAIN */}
                <div className="bg-[#ffffff] rounded-xl p-space-lg flex flex-col justify-between space-y-space-lg shadow-xs border border-[#e9e8e5] hover:shadow-md transition-all">
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-[#44474a] tracking-widest bg-[#efeeeb] px-space-xs py-space-2xs rounded-full font-semibold">
                        Stage 02
                      </span>
                      <span className="font-code-sm text-code-sm text-[#75777a]">CFG-TRAVERSAL</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Explain</h3>
                      <p className="font-body-sm text-body-sm text-[#44474a] leading-relaxed">
                        Synthesizes a concrete symbolic transaction sequence detailing how state manipulation is achieved.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#efeeeb] p-space-sm rounded-lg space-y-1 font-code-sm text-code-sm text-[#1b1c1a]">
                    <div className="flex items-center justify-between text-[#75777a]">
                      <span>Attack Simulation</span>
                      <span>2 iterations</span>
                    </div>
                    <div className="text-[#1b1c1a] font-mono truncate">drain: 24.50 ETH</div>
                    <div className="text-[#37675d] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">account_tree</span>
                      <span>Recursive invocation loop</span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: PATCH */}
                <div className="bg-[#ffffff] rounded-xl p-space-lg flex flex-col justify-between space-y-space-lg shadow-xs border border-[#e9e8e5] hover:shadow-md transition-all">
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-[#37675d] tracking-widest bg-[#baede0]/40 px-space-xs py-space-2xs rounded-full font-semibold">
                        Stage 03
                      </span>
                      <span className="font-code-sm text-code-sm text-[#75777a]">AST-MUTATION</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Patch</h3>
                      <p className="font-body-sm text-body-sm text-[#44474a] leading-relaxed">
                        Generates a minimal, non-breaking Git-compatible diff aligning code with Checks-Effects-Interactions.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#191c1f] p-space-sm rounded-lg space-y-1 text-[#828488] font-code-sm text-code-sm">
                    <div className="flex items-center justify-between text-[#e1e2e6]">
                      <span>Proposed Diff</span>
                      <span className="text-[#86d6bb] font-medium">CEI Guard</span>
                    </div>
                    <div className="text-[#86d6bb] truncate font-mono">+ balances[msg.sender] = 0;</div>
                    <div className="text-[#e1e2e6] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">code</span>
                      <span>State updated before transfer</span>
                    </div>
                  </div>
                </div>

                {/* CARD 4: VERIFY */}
                <div className="bg-[#ffffff] rounded-xl p-space-lg flex flex-col justify-between space-y-space-lg shadow-xs border border-[#e9e8e5] hover:shadow-md transition-all">
                  <div className="space-y-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-[#37675d] tracking-widest bg-[#baede0]/50 px-space-xs py-space-2xs rounded-full font-semibold">
                        Stage 04
                      </span>
                      <span className="font-code-sm text-code-sm text-[#37675d] font-bold">PROVED</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Verify</h3>
                      <p className="font-body-sm text-body-sm text-[#44474a] leading-relaxed">
                        Runs patched AST against the original adversarial test harness to guarantee zero regression.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#efeeeb] p-space-sm rounded-lg space-y-1 font-code-sm text-code-sm text-[#1b1c1a]">
                    <div className="flex items-center justify-between text-[#75777a]">
                      <span>Differential Suite</span>
                      <span className="text-[#37675d] font-medium">100% Passed</span>
                    </div>
                    <div className="text-[#1b1c1a] font-mono truncate">TestReentrancy() -&gt; REVERT</div>
                    <div className="text-[#37675d] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">task_alt</span>
                      <span>Exploit vector neutralized</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LIVE SECURITY REPORT PREVIEW: Split Deck Inspection Viewport */}
          <section id="demo-preview" className="w-full bg-[#faf9f6] py-space-3xl lg:py-space-4xl">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop space-y-space-xl">
              {/* Section Metabar */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                <div className="space-y-space-2xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-caps text-label-caps text-[#75777a] uppercase tracking-wider">
                      Live Specimen Inspection
                    </span>
                    <span className="px-space-xs py-0.5 rounded bg-[#e9e8e5] font-code-sm text-code-sm text-[#44474a]">
                      ETH-MAINNET
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-[#1b1c1a] tracking-tight">
                    VaultLiquidityReserve.sol
                  </h2>
                  <p className="font-body-base text-body-base text-[#44474a]">
                    Reentrancy vulnerability identified in withdrawal lifecycle, verified with differential AST proof.
                  </p>
                </div>

                {/* Comparative Metrics Badges */}
                <div className="flex items-center gap-space-md">
                  <div className="bg-[#f4f3f0] px-space-md py-space-sm rounded-xl space-y-0.5 shadow-2xs border border-[#e9e8e5]">
                    <span className="font-label-caps text-label-caps uppercase text-[#ba1a1a]">Unpatched Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-[#ba1a1a] font-semibold">42</span>
                      <span className="font-code-sm text-code-sm text-[#75777a]">/ 100</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#75777a]">
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </div>
                  <div className="bg-[#baede0]/30 px-space-md py-space-sm rounded-xl space-y-0.5 shadow-2xs border border-[#37675d]/20">
                    <span className="font-label-caps text-label-caps uppercase text-[#37675d]">Verified Patch</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-lg text-headline-lg text-[#37675d] font-semibold">94</span>
                      <span className="font-code-sm text-code-sm text-[#37675d]">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Obsidian Analytical Execution Deck (The Recessed Dark Container) */}
              <div className="bg-[#191c1f] rounded-xl overflow-hidden shadow-xl border border-white/5 text-[#ffffff]">
                {/* Deck Header Strip */}
                <div className="bg-[#111719] px-space-lg py-space-sm flex flex-wrap items-center justify-between gap-space-sm text-[#828488] font-code-sm text-code-sm border-b border-white/5">
                  <div className="flex items-center gap-space-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]/70"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5c5f62]"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#37675d]/70"></span>
                    </div>
                    <span className="text-[#c5c6ca] font-mono font-medium">contracts/VaultLiquidityReserve.sol</span>
                    <span className="hidden sm:inline text-[#44474a] font-mono">commit: a94f78e</span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[#c5c6ca] font-label-caps uppercase">Solidity 0.8.20</span>
                    <span className="px-2 py-0.5 rounded bg-[#baede0]/20 text-[#86d6bb] font-label-caps uppercase">AST Mutator Active</span>
                  </div>
                </div>

                {/* Code & Diff Split Deck */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                  {/* Left Sub-Pane: Vulnerable Source Lines 18-24 */}
                  <div className="lg:col-span-7 p-space-lg font-code-base text-code-base leading-relaxed overflow-x-auto space-y-2">
                    <div className="flex items-center justify-between pb-space-xs text-[#828488] font-label-caps uppercase">
                      <span>Source Disassembly</span>
                      <span className="text-[#ffdad6] font-medium">Lines 18 - 25 Flagged</span>
                    </div>
                    <div className="space-y-0.5 font-mono text-xs">
                      <div className="flex items-center text-[#75777a]">
                        <span className="w-8 select-none text-right pr-4">16</span>
                        <span className="text-[#e1e2e6]">function withdraw(uint256 amount) public &#123;</span>
                      </div>
                      <div className="flex items-center text-[#75777a]">
                        <span className="w-8 select-none text-right pr-4">17</span>
                        <span className="text-[#e1e2e6] pl-4">require(balances[msg.sender] &gt;= amount, "Insufficient");</span>
                      </div>
                      {/* Vulnerable Trace Highlight */}
                      <div className="flex items-center bg-[#ba1a1a]/15 text-[#ffdad6] py-1 -mx-2 px-2 rounded">
                        <span className="w-8 select-none text-right pr-4 text-[#ba1a1a]">18</span>
                        <span className="pl-4 font-semibold text-[#ffdad6]">// [VULNERABILITY] External untrusted call before state mutation</span>
                      </div>
                      <div className="flex items-center bg-[#ba1a1a]/15 text-[#ffdad6] py-1 -mx-2 px-2 rounded">
                        <span className="w-8 select-none text-right pr-4 text-[#ba1a1a]">19</span>
                        <span className="pl-4 font-mono">(bool success, ) = msg.sender.call&#123;value: amount&#125;("");</span>
                      </div>
                      <div className="flex items-center bg-[#ba1a1a]/15 text-[#ffdad6] py-1 -mx-2 px-2 rounded">
                        <span className="w-8 select-none text-right pr-4 text-[#ba1a1a]">20</span>
                        <span className="pl-4 font-mono">require(success, "Transfer failed");</span>
                      </div>
                      <div className="flex items-center text-[#75777a]">
                        <span className="w-8 select-none text-right pr-4">21</span>
                        <span className="text-[#e1e2e6] pl-4">balances[msg.sender] -= amount;</span>
                      </div>
                      <div className="flex items-center text-[#75777a]">
                        <span className="w-8 select-none text-right pr-4">22</span>
                        <span className="text-[#e1e2e6] pl-4">emit Withdrawn(msg.sender, amount);</span>
                      </div>
                      <div className="flex items-center text-[#75777a]">
                        <span className="w-8 select-none text-right pr-4">23</span>
                        <span className="text-[#e1e2e6]">&#125;</span>
                      </div>
                    </div>

                    {/* In-Line Forensics Box */}
                    <div className="mt-space-md p-space-sm rounded bg-black/40 space-y-1 font-body-sm text-body-sm border border-white/5">
                      <div className="flex items-center gap-space-xs text-[#ffdad6] font-medium">
                        <span className="material-symbols-outlined text-[15px] text-[#ba1a1a]">report_problem</span>
                        <span>Exploit Vector: SWC-107 Reentrancy (Cross-function)</span>
                      </div>
                      <p className="text-[#828488]">
                        Control flow relinquished to <code className="text-[#e1e2e6]">msg.sender</code> before <code className="text-[#e1e2e6]">balances</code> is updated, allowing attacker re-entry through fallback.
                      </p>
                    </div>
                  </div>

                  {/* Right Sub-Pane: Proposed Automated Diff & Test Invariance */}
                  <div className="lg:col-span-5 p-space-lg flex flex-col justify-between space-y-space-md bg-[#141b1d]">
                    <div className="space-y-space-sm">
                      <div className="flex items-center justify-between text-[#828488] font-label-caps uppercase">
                        <span>Proposed Remediation</span>
                        <span className="text-[#86d6bb] font-medium">Verified by Invariant Engine</span>
                      </div>

                      {/* Unified Diff Snippet */}
                      <div className="bg-black/50 p-space-sm rounded-lg font-code-sm text-code-sm space-y-1 font-mono border border-white/5">
                        <div className="text-[#75777a]">@@ -18,4 +18,4 @@ function withdraw()</div>
                        <div className="text-[#ffdad6] bg-[#ba1a1a]/10 px-1 rounded">- (bool success, ) = msg.sender.call&#123;value: amount&#125;("");</div>
                        <div className="text-[#86d6bb] bg-[#37675d]/25 px-1 rounded font-medium">+ balances[msg.sender] -= amount; // Effect First</div>
                        <div className="text-[#86d6bb] bg-[#37675d]/25 px-1 rounded font-medium">+ (bool success, ) = msg.sender.call&#123;value: amount&#125;(""); // Interaction</div>
                        <div className="text-[#828488] pl-2">  require(success, "Transfer failed");</div>
                      </div>

                      {/* Verification Checks Table */}
                      <div className="space-y-1 pt-space-xs">
                        <span className="font-label-caps text-[10px] uppercase tracking-wider text-[#75777a]">Formal Invariant Pass Rates</span>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between py-1 px-2 rounded bg-white/5">
                            <span className="text-[#c5c6ca] font-mono">Inv 01: Balance Monotonicity</span>
                            <span className="text-[#86d6bb] font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">check</span> PASS
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 px-2 rounded bg-white/5">
                            <span className="text-[#c5c6ca] font-mono">Inv 02: Reentrancy Gas Guard</span>
                            <span className="text-[#86d6bb] font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">check</span> PASS
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1 px-2 rounded bg-white/5">
                            <span className="text-[#c5c6ca] font-mono">Inv 03: Gas Overhead &le; 180 gas</span>
                            <span className="text-[#86d6bb] font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">check</span> PASS
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Trigger in Inspector */}
                    <div className="pt-space-sm flex items-center justify-between gap-space-xs border-t border-white/5">
                      <span className="font-code-sm text-code-sm text-[#75777a]">Automated PR Ready</span>
                      <button
                        onClick={() => {
                          if (onSelectFindingForWorkbench) {
                            onSelectFindingForWorkbench();
                          } else {
                            onNavigate('patch-review');
                          }
                        }}
                        className="px-space-md py-space-xs rounded-full bg-[#37675d] text-[#ffffff] font-label-caps text-label-caps uppercase tracking-wider hover:bg-[#3e6d63] transition-all cursor-pointer active:scale-95 shadow-sm"
                      >
                        Apply Patch in Workbench &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROTOCOL TELEMETRY & METHODOLOGY HIGHLIGHTS */}
          <section className="w-full bg-[#efeeeb] py-16 lg:py-24 border-y border-[#e9e8e5]">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
                <div className="space-y-space-xs">
                  <div className="flex items-center gap-space-xs text-[#37675d]">
                    <span className="material-symbols-outlined text-[20px]">rule</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">Checks-Effects-Interactions</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Structural Inversion</h4>
                  <p className="font-body-base text-body-base text-[#44474a] leading-relaxed">
                    Reorganizes storage write instructions strictly prior to internal or external EVM message passes without breaking execution semantic order.
                  </p>
                </div>

                <div className="space-y-space-xs">
                  <div className="flex items-center gap-space-xs text-[#37675d]">
                    <span className="material-symbols-outlined text-[20px]">memory</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">Bytecode Disassembly</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Deterministic Parsing</h4>
                  <p className="font-body-base text-body-base text-[#44474a] leading-relaxed">
                    Analyzes raw Yul intermediate representation and compiled bytecode to guarantee compiler-introduced edge cases are evaluated directly.
                  </p>
                </div>

                <div className="space-y-space-xs">
                  <div className="flex items-center gap-space-xs text-[#37675d]">
                    <span className="material-symbols-outlined text-[20px]">fact_check</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">Foundry Test Synthesis</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-[#1b1c1a]">Reproducible Proofs</h4>
                  <p className="font-body-base text-body-base text-[#44474a] leading-relaxed">
                    Outputs turnkey Foundry and Hardhat test harnesses configured to fail on the unpatched codebase and assert success on the verified patch.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL EDITORIAL CTA SECTION */}
          <section className="w-full bg-[#faf9f6] py-20 lg:py-32">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Architectural Eyebrow */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#efeeeb] text-[#44474a] font-label-caps text-label-caps uppercase tracking-widest border border-[#e3e2df]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]"></span>
                  <span>Integrity By Construction</span>
                </div>

                {/* The Core Brand Promise Quote */}
                <blockquote className="font-headline-lg text-2xl sm:text-3xl lg:text-[34px] text-[#1b1c1a] tracking-tight leading-snug px-2">
                  &ldquo;SecureChain AI does not merely find a vulnerability. It shows the evidence, explains the attack, proposes a fix, and verifies whether the fix worked.&rdquo;
                </blockquote>

                <p className="font-body-lg text-base lg:text-lg text-[#44474a] max-w-xl mx-auto leading-relaxed">
                  Deploy hardened Solidity with cryptographic assurance. Connect your repository to inspect your smart contracts today.
                </p>

                {/* Final Restrained Graphite Actions */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      if (AuthService.isAuthenticated()) {
                        onNavigate('overview', '/app');
                      } else {
                        onNavigate('login', '/login');
                      }
                    }}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#000000] text-[#ffffff] hover:bg-[#191c1f] transition-all text-sm font-semibold tracking-tight shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                  >
                    <span>Analyze a Contract Now</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => onNavigate('methodology')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] transition-all text-sm font-medium border border-[#e3e2df] cursor-pointer"
                  >
                    <span>Read Audit Methodology</span>
                  </button>
                </div>

                {/* Micro Assurance Telemetry */}
                <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[#44474a] font-code-sm text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#37675d]">check</span>
                    <span>Zero Telemetry Leakage</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#37675d]">check</span>
                    <span>Local AST Execution</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#37675d]">check</span>
                    <span>Fully Open Source Rules</span>
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="w-full bg-[#f4f3f0] border-t border-[#e9e8e5]">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop py-16 lg:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#e9e8e5]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <img
                  alt="SecureChain AI Shield Logo"
                  className="h-6 w-auto object-contain"
                  src={SHIELD_LOGO_URL}
                />
                <span className="font-headline-sm text-base font-semibold text-[#1b1c1a]">SecureChain AI</span>
              </div>
              <p className="font-code-base text-xs text-[#44474a] tracking-wide uppercase">
                Detect. Explain. Patch. Verify.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-[#44474a] font-body-base text-sm">
              <button onClick={() => onNavigate('overview')} className="hover:text-[#1b1c1a] transition-colors cursor-pointer">
                Inspection Console
              </button>
              <button onClick={() => onNavigate('methodology')} className="hover:text-[#1b1c1a] transition-colors cursor-pointer">
                Verification Protocol
              </button>
              <button onClick={() => onNavigate('demo-gallery')} className="hover:text-[#1b1c1a] transition-colors cursor-pointer">
                Audit Archive
              </button>
              <button onClick={() => onNavigate('settings')} className="hover:text-[#1b1c1a] transition-colors cursor-pointer">
                Privacy &amp; Integrity
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#75777a] font-code-sm text-xs">
            <p>Platform Integrity Verified. Deterministic AST verification engine.</p>
            <p>&copy; 2025 SecureChain AI Inc. Cryptographic Assurance Guaranteed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
