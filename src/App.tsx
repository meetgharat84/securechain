import { useState, useEffect, useCallback } from 'react';
import type { AppScreen, Finding } from './types';
import { INITIAL_FINDINGS, TREASURY_VAULT_SOURCE } from './data/mockData';
import { DeterministicSecurityEngine } from './services/securityEngine';

// Components
import { LandingPage } from './components/LandingPage';
import { OverviewView } from './components/OverviewView';
import { PatchReviewView } from './components/PatchReviewView';
import { AttackReplayView } from './components/AttackReplayView';
import { ScanHistoryView } from './components/ScanHistoryView';
import { ProjectsView } from './components/ProjectsView';
import { DemoGalleryView } from './components/DemoGalleryView';
import { MethodologyView } from './components/MethodologyView';
import { SettingsView } from './components/SettingsView';
import { ProfileView } from './components/ProfileView';
import { CompareView } from './components/CompareView';
import { NewAnalysisView } from './components/NewAnalysisView';
import { ScanProgressView } from './components/ScanProgressView';
import { NewScanModal } from './components/NewScanModal';
import { ConsoleHeader } from './components/ConsoleHeader';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { Toast } from './components/Toast';
import { LoginView } from './components/LoginView';
import type { UserDoc } from './server/models';
import { AuthService } from './services/authService';

const getInitialScreen = (): { screen: AppScreen; findingId?: string } => {
  if (typeof window === 'undefined') return { screen: 'landing' };
  const path = window.location.pathname;
  if (path === '/' || path === '') return { screen: 'landing' };
  if (path === '/login' || path === '/login/') return { screen: 'login' };
  if (path === '/register' || path === '/register/') return { screen: 'register' };
  if (path === '/how-it-works' || path === '/methodology') return { screen: 'methodology' };
  if (path === '/gallery' || path === '/demo-gallery') return { screen: 'demo-gallery' };

  // Route protection for console screens: if unauthenticated, redirect to /login
  if (!AuthService.isAuthenticated()) {
    if (path.startsWith('/app')) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.history.replaceState({}, '', '/login');
      }
      return { screen: 'login' };
    }
  }

  if (path === '/app' || path === '/app/') return { screen: 'overview' };
  if (path.startsWith('/app/analyze') && path.includes('/progress')) return { screen: 'scan-progress' };
  if (path.startsWith('/app/analyze')) return { screen: 'new-analysis' };
  if (path.includes('/patch/')) return { screen: 'patch-review' };
  if (path.includes('/verification/')) return { screen: 'attack-replay' };
  if (path.includes('/findings/')) {
    const match = path.match(/\/findings\/([^/]+)/);
    return { screen: 'overview', findingId: match?.[1] };
  }
  if (path.startsWith('/app/reports/')) return { screen: 'overview' };
  if (path === '/app/history') return { screen: 'scan-history' };
  if (path === '/app/compare') return { screen: 'compare' };
  if (path === '/app/projects') return { screen: 'projects' };
  if (path === '/app/profile') return { screen: 'profile' };
  if (path === '/app/settings') return { screen: 'settings' };

  return { screen: 'landing' };
};

export function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => getInitialScreen().screen);
  const [activeTarget, setActiveTarget] = useState<string>('Treasury Protocols');
  const [selectedFindingId, setSelectedFindingId] = useState<string>(() => getInitialScreen().findingId || 'f-1');
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserDoc | null>(() => AuthService.getCurrentUser());

  const isConsoleScreen = currentScreen !== 'landing' && currentScreen !== 'login' && currentScreen !== 'register';

  // Active Contract and Findings State
  const [activeContractName, setActiveContractName] = useState<string>('VulnerableVault.sol');
  const [activeSourceCode, setActiveSourceCode] = useState<string>(TREASURY_VAULT_SOURCE);
  const [currentFindings, setCurrentFindings] = useState<Finding[]>(INITIAL_FINDINGS);

  // Sync route to URL
  const navigateTo = useCallback((screen: AppScreen, urlPath?: string) => {
    setCurrentScreen(screen);
    const targetUrl = urlPath || (
      screen === 'landing' ? '/' :
      screen === 'login' ? '/login' :
      screen === 'register' ? '/register' :
      screen === 'overview' ? '/app' :
      screen === 'new-analysis' ? '/app/analyze' :
      screen === 'scan-progress' ? '/app/analyze/active/progress' :
      screen === 'patch-review' ? '/app/reports/REP-84102-SEC/patch/f-1' :
      screen === 'attack-replay' ? '/app/reports/REP-84102-SEC/verification/vrun_09' :
      screen === 'scan-history' ? '/app/history' :
      screen === 'compare' ? '/app/compare' :
      screen === 'projects' ? '/app/projects' :
      screen === 'profile' ? '/app/profile' :
      screen === 'settings' ? '/app/settings' :
      screen === 'methodology' ? '/methodology' :
      screen === 'demo-gallery' ? '/gallery' : '/app'
    );

    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keep currentUser synchronized with auth state & redirect on logout
  useEffect(() => {
    const unsubscribe = AuthService.subscribe((state) => {
      setCurrentUser(state.user);
      if (!state.isAuthenticated && isConsoleScreen) {
        navigateTo('login', '/login');
      }
    });
    return unsubscribe;
  }, [navigateTo, isConsoleScreen]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { screen, findingId } = getInitialScreen();
      setCurrentScreen(screen);
      if (findingId) setSelectedFindingId(findingId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut listener (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsNewScanModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Start analysis trigger from Modal or NewAnalysisView
  const handleStartScan = (
    contractName: string,
    source: string,
    compilerVersion: string,
    profile: 'Quick' | 'Standard' | 'Deep'
  ) => {
    void compilerVersion;
    void profile;
    setActiveContractName(contractName);
    setActiveSourceCode(source);

    // Run deterministic analysis
    const result = DeterministicSecurityEngine.analyzeContract(source, contractName);
    setCurrentFindings(result.findings.map(f => ({
      id: f.id,
      findingNumber: f.findingNumber,
      title: f.title,
      severity: f.severity,
      detector: f.detector,
      functionName: f.functionName,
      lines: f.lines,
      startLine: f.lineStart,
      endLine: f.lineEnd,
      swcId: f.swcId,
      cweId: f.cweId,
      confidence: f.confidence,
      description: f.description,
      evidence: f.evidence,
      explanationDetails: f.explanation,
      recommendation: f.remediation,
      status: f.status
    })));

    if (result.findings.length > 0) {
      setSelectedFindingId(result.findings[0].id);
    }

    // Navigate to live progress screen
    navigateTo('scan-progress');
  };

  const handleScanProgressComplete = () => {
    navigateTo('overview');
    setToastMessage(`Analysis completed: ${currentFindings.length} vulnerabilities found.`);
  };


  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1b1c1a] flex flex-col font-sans selection:bg-[#37675d]/20 selection:text-[#1b1c1a]">
      {/* Toast Notification Container */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
        onOpenNewScan={() => setIsNewScanModalOpen(true)}
      />

      {/* Global New Scan Modal */}
      <NewScanModal
        isOpen={isNewScanModalOpen}
        onClose={() => setIsNewScanModalOpen(false)}
        onStartScan={handleStartScan}
      />

      {/* EDITORIAL LANDING PAGE */}
      {currentScreen === 'landing' && (
        <LandingPage
          onNavigate={navigateTo}
          onOpenNewScan={() => setIsNewScanModalOpen(true)}
          onSelectFindingForWorkbench={() => setSelectedFindingId('f-1')}
        />
      )}

      {/* AUTHENTICATION PAGES (/login, /register) */}
      {(currentScreen === 'login' || currentScreen === 'register') && (
        <LoginView
          key={currentScreen}
          initialMode={currentScreen === 'register' ? 'register' : 'login'}
          onNavigate={navigateTo}
          onShowToast={setToastMessage}
        />
      )}

      {/* APP CONSOLE SHELL (Overview, Workbench, History, Settings, etc.) */}
      {isConsoleScreen && (
        <div className="flex w-full min-h-screen">
          {/* Left Fixed Navigation Sidebar */}
          <Sidebar
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            activeTarget={activeTarget}
            onSelectTarget={setActiveTarget}
            onOpenNewScan={() => setIsNewScanModalOpen(true)}
            currentUser={currentUser}
          />

          {/* Right Content Area */}
          <div className="flex-1 ml-64 flex flex-col min-h-screen bg-[#faf9f6]">
            {/* Top Fixed Header */}
            <ConsoleHeader
              currentScreen={currentScreen}
              activeTarget={activeTarget}
              onSelectTarget={setActiveTarget}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenNewScan={() => setIsNewScanModalOpen(true)}
              onNavigate={navigateTo}
              currentUser={currentUser}
            />

            {/* Main View Router */}
            <main className="flex-1 pt-16 pb-12 overflow-x-hidden">
              {currentScreen === 'overview' && (
                <OverviewView
                  onNavigate={navigateTo}
                  selectedFindingId={selectedFindingId}
                  onSelectFinding={(id) => {
                    setSelectedFindingId(id);
                    window.history.pushState({}, '', `/app/reports/REP-84102-SEC/findings/${id}`);
                  }}
                  onOpenNewScan={() => setIsNewScanModalOpen(true)}
                  activeTarget={activeTarget}
                  onShowToast={setToastMessage}
                  customFindings={currentFindings}
                  customSourceCode={activeSourceCode}
                  contractName={activeContractName}
                />
              )}

              {currentScreen === 'new-analysis' && (
                <NewAnalysisView
                  onNavigate={navigateTo}
                  onStartScan={handleStartScan}
                  onShowToast={setToastMessage}
                />
              )}

              {currentScreen === 'scan-progress' && (
                <ScanProgressView
                  contractName={activeContractName}
                  onComplete={handleScanProgressComplete}
                  onCancel={() => navigateTo('overview')}
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'patch-review' && (
                <PatchReviewView
                  onNavigate={navigateTo}
                  onShowToast={setToastMessage}
                />
              )}

              {currentScreen === 'attack-replay' && (
                <AttackReplayView
                  onNavigate={navigateTo}
                  onShowToast={setToastMessage}
                />
              )}

              {currentScreen === 'scan-history' && (
                <ScanHistoryView
                  onNavigate={navigateTo}
                  onSelectTarget={setActiveTarget}
                  onOpenNewScan={() => setIsNewScanModalOpen(true)}
                  onShowToast={setToastMessage}
                />
              )}

              {currentScreen === 'projects' && (
                <ProjectsView
                  onNavigate={navigateTo}
                  onSelectTarget={setActiveTarget}
                />
              )}

              {currentScreen === 'demo-gallery' && (
                <DemoGalleryView
                  onNavigate={navigateTo}
                  onSelectFindingForWorkbench={() => setSelectedFindingId('f-1')}
                />
              )}

              {currentScreen === 'methodology' && (
                <MethodologyView
                  onNavigate={navigateTo}
                />
              )}

              {currentScreen === 'settings' && (
                <SettingsView
                  onNavigate={navigateTo}
                  onShowToast={setToastMessage}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileView
                  onNavigate={navigateTo}
                  onShowToast={setToastMessage}
                  currentUser={currentUser}
                  onUserUpdated={setCurrentUser}
                />
              )}

              {currentScreen === 'compare' && (
                <CompareView
                  onNavigate={navigateTo}
                  onShowToast={setToastMessage}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
