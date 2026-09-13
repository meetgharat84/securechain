import React, { useState, useEffect } from 'react';
import type { AppScreen } from '../types';
import { ApiService } from '../server/api';
import type { UserDoc, WorkspaceDoc } from '../server/models';
import { getUserInitials, AuthService } from '../services/authService';

interface ProfileViewProps {
  onNavigate: (screen: AppScreen, urlPath?: string) => void;
  onShowToast: (msg: string) => void;
  currentUser?: UserDoc | null;
  onUserUpdated?: (user: UserDoc) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigate,
  onShowToast,
  currentUser,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'workspace' | 'security' | 'danger'>('personal');
  
  const [isLoadingUser, setIsLoadingUser] = useState(!currentUser);
  const [userLoadError, setUserLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Personal Info State — initialized from currentUser or empty, never hardcoded demo values
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [role, setRole] = useState(currentUser?.role || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Workspace State
  const [workspaceName, setWorkspaceName] = useState('Treasury Protocols');
  const [privacy, setPrivacy] = useState<'private' | 'team' | 'public'>('team');
  const [retentionDays, setRetentionDays] = useState(90);
  const [compilerVersion, setCompilerVersion] = useState('0.8.20');
  const [analysisProfile, setAnalysisProfile] = useState<'Quick' | 'Standard' | 'Deep'>('Standard');

  // Security Preferences
  const [requireVerification, setRequireVerification] = useState(true);
  const [beginnerFriendly, setBeginnerFriendly] = useState(true);
  const [analyzerLogs, setAnalyzerLogs] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Load profile and workspace data
  useEffect(() => {
    let isCancelled = false;

    ApiService.getCurrentUser()
      .then((u) => {
        if (isCancelled) return;
        setName(u.name || AuthService.deriveNameFromEmail(u.email));
        setEmail(u.email);
        setRole(u.role || 'Smart Contract Security Auditor');
        setAvatar(u.avatar || '');
        setUserLoadError(null);
        setIsLoadingUser(false);
        onUserUpdated?.(u);
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load user profile';
        setUserLoadError(msg);
        setIsLoadingUser(false);
        if (!AuthService.isAuthenticated()) {
          onNavigate('login', '/login');
        }
      });

    ApiService.getWorkspace()
      .then((w: WorkspaceDoc) => {
        if (isCancelled) return;
        setWorkspaceName(w.name);
        setPrivacy(w.privacy);
        setRetentionDays(w.retentionDays);
        setCompilerVersion(w.defaultCompilerVersion);
        setAnalysisProfile(w.defaultAnalysisProfile);
        setRequireVerification(w.securityPreferences.requireVerificationBeforeCompletion);
        setBeginnerFriendly(w.securityPreferences.beginnerFriendlyExplanations);
        setAnalyzerLogs(w.securityPreferences.analyzerLogs);
        setNotifications(w.securityPreferences.notifications);
      })
      .catch(() => {});

    return () => {
      isCancelled = true;
    };
  }, [onNavigate, onUserUpdated]);

  const handleRetry = () => {
    setIsLoadingUser(true);
    setUserLoadError(null);
    ApiService.getCurrentUser()
      .then((u) => {
        setName(u.name || AuthService.deriveNameFromEmail(u.email));
        setEmail(u.email);
        setRole(u.role || 'Smart Contract Security Auditor');
        setAvatar(u.avatar || '');
        setUserLoadError(null);
        setIsLoadingUser(false);
        onUserUpdated?.(u);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load user profile';
        setUserLoadError(msg);
        setIsLoadingUser(false);
      });
  };

  const handleSavePersonal = async () => {
    if (!name.trim()) {
      onShowToast('Please enter your full name.');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await ApiService.updateProfile({ name: name.trim(), email, role });
      setName(updated.name);
      setRole(updated.role);
      onUserUpdated?.(updated);
      onShowToast('Personal profile changes saved successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile changes.';
      onShowToast(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWorkspace = async () => {
    try {
      await ApiService.updateWorkspace({
        name: workspaceName,
        privacy,
        retentionDays,
        defaultCompilerVersion: compilerVersion,
        defaultAnalysisProfile: analysisProfile,
        securityPreferences: {
          requireVerificationBeforeCompletion: requireVerification,
          beginnerFriendlyExplanations: beginnerFriendly,
          analyzerLogs,
          notifications,
        },
      });
      onShowToast('Workspace settings and security preferences updated.');
    } catch {
      onShowToast('Failed to update workspace settings.');
    }
  };

  const handleExportData = () => {
    const data = {
      workspace: workspaceName,
      user: { name, email, role },
      retentionDays,
      securityPreferences: {
        requireVerification,
        beginnerFriendly,
        analyzerLogs,
        notifications,
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securechain_workspace_${workspaceName.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Workspace data archive exported successfully.');
  };

  const handleDeleteWorkspace = () => {
    const confirmation = prompt(`Type "${workspaceName}" to confirm deletion of this workspace:`);
    if (confirmation === workspaceName) {
      alert('Workspace reset. Restoring baseline demo workspace.');
      window.location.reload();
    } else if (confirmation !== null) {
      alert('Confirmation did not match. Deletion aborted.');
    }
  };

  return (
    <div className="p-space-lg max-w-[1200px] mx-auto space-y-space-md animate-fadeIn">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={() => onNavigate('overview')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#75777a] hover:text-[#1b1c1a] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to Audit Console</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-headline-md text-headline-md text-[#1b1c1a]">Profile &amp; Workspace Settings</h1>
        <p className="font-body-base text-body-base text-[#44474a]">
          Manage your auditor credentials, workspace retention policies, Solidity compilation defaults, and formal verification preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e9e8e5] gap-space-md font-mono text-xs">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'personal'
              ? 'border-b-2 border-[#1b1c1a] font-bold text-[#1b1c1a]'
              : 'text-[#75777a] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">person</span>
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab('workspace')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'workspace'
              ? 'border-b-2 border-[#1b1c1a] font-bold text-[#1b1c1a]'
              : 'text-[#75777a] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">corporate_fare</span>
          <span>Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-b-2 border-[#1b1c1a] font-bold text-[#1b1c1a]'
              : 'text-[#75777a] hover:text-[#1b1c1a]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">shield</span>
          <span>Security Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('danger')}
          className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'danger'
              ? 'border-b-2 border-[#ba1a1a] font-bold text-[#ba1a1a]'
              : 'text-[#75777a] hover:text-[#ba1a1a]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">warning</span>
          <span>Danger Zone</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e9e8e5] p-space-lg shadow-xs space-y-space-lg">
        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="space-y-space-md max-w-xl">
            {isLoadingUser && !email ? (
              <div className="p-8 space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#e9e8e5]"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-[#e9e8e5] rounded"></div>
                    <div className="h-3 w-48 bg-[#e9e8e5] rounded"></div>
                  </div>
                </div>
                <div className="h-10 bg-[#e9e8e5] rounded"></div>
                <div className="h-10 bg-[#e9e8e5] rounded"></div>
              </div>
            ) : userLoadError && !email ? (
              <div className="p-4 rounded-lg bg-[#ffdad6]/30 border border-[#ba1a1a]/30 text-xs text-[#ba1a1a] flex items-center justify-between">
                <span>{userLoadError}</span>
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 bg-[#ba1a1a] text-white rounded text-xs font-medium cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-space-md">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#e9e8e5] shadow-xs"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#37675d] text-[#ffffff] font-semibold text-lg flex items-center justify-center border-2 border-[#e9e8e5] shadow-xs select-none tracking-wider">
                      {getUserInitials(name, email)}
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="font-headline-sm text-sm font-semibold text-[#1b1c1a] block">
                      Auditor Avatar
                    </span>
                    <span className="text-xs text-[#75777a] block">
                      Managed via team authentication profile.
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSaving}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 text-xs font-sans bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none focus:border-[#37675d]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                      Email Address
                    </label>
                    <span className="text-[10px] text-[#75777a]">Read-only</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    title="Account email address is read-only"
                    className="w-full px-3 py-2 text-xs font-sans bg-[#efeeeb] text-[#44474a] border border-[#e9e8e5] rounded-lg cursor-not-allowed select-none"
                  />
                  <p className="text-[10px] text-[#75777a]">
                    Authenticated workspace email is managed via your identity session.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                    Protocol Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isSaving}
                    placeholder="e.g. Lead Protocol Auditor"
                    className="w-full px-3 py-2 text-xs font-sans bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none focus:border-[#37675d]"
                  />
                </div>

                <div className="pt-space-xs">
                  <button
                    onClick={handleSavePersonal}
                    disabled={isSaving}
                    className="px-space-md py-2 bg-[#000000] hover:bg-[#191c1f] text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: WORKSPACE */}
        {activeTab === 'workspace' && (
          <div className="space-y-space-md max-w-xl">
            <div className="space-y-1">
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-3 py-2 text-xs font-sans bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none focus:border-[#37675d]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                Workspace Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as 'private' | 'team' | 'public')}
                className="w-full px-3 py-2 text-xs font-sans bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
              >
                <option value="private">Private (Only invited signatories)</option>
                <option value="team">Team (Entire protocol security organization)</option>
                <option value="public">Public (Open verifiable audit archive)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                Contract Retention Policy (Days)
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
              />
              <span className="text-[11px] text-[#75777a]">
                Historical bytecode traces, differential AST graphs, and invariant logs are retained for this period.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                Default Compiler Version (solc)
              </label>
              <select
                value={compilerVersion}
                onChange={(e) => setCompilerVersion(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#f4f3f0] border border-[#e9e8e5] rounded-lg focus:outline-none"
              >
                <option value="0.8.28">0.8.28</option>
                <option value="0.8.24">0.8.24</option>
                <option value="0.8.20">0.8.20 (Default)</option>
                <option value="0.8.19">0.8.19</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-label-caps text-[10px] text-[#75777a] uppercase font-semibold block">
                Default Analysis Profile
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Quick', 'Standard', 'Deep'] as const).map((prof) => (
                  <button
                    key={prof}
                    type="button"
                    onClick={() => setAnalysisProfile(prof)}
                    className={`py-2 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                      analysisProfile === prof
                        ? 'bg-[#baede0]/40 border-[#37675d] text-[#1e4f46] font-semibold'
                        : 'bg-[#efeeeb] border-[#e9e8e5] text-[#44474a]'
                    }`}
                  >
                    {prof}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-space-xs">
              <button
                onClick={handleSaveWorkspace}
                className="px-space-md py-2 bg-[#000000] hover:bg-[#191c1f] text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Save Workspace Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY PREFERENCES */}
        {activeTab === 'security' && (
          <div className="space-y-space-md max-w-xl">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f4f3f0] border border-[#e9e8e5]">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#1b1c1a] block">
                  Require verification before completion
                </span>
                <span className="text-[11px] text-[#75777a] block">
                  Audit reports cannot be marked verified until invariant regression suites pass.
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireVerification}
                onChange={(e) => setRequireVerification(e.target.checked)}
                className="w-4 h-4 accent-[#37675d] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f4f3f0] border border-[#e9e8e5]">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#1b1c1a] block">
                  Beginner-friendly explanations
                </span>
                <span className="text-[11px] text-[#75777a] block">
                  Synthesize plain English explanations detailing what happened, why it matters, and exploit scenarios.
                </span>
              </div>
              <input
                type="checkbox"
                checked={beginnerFriendly}
                onChange={(e) => setBeginnerFriendly(e.target.checked)}
                className="w-4 h-4 accent-[#37675d] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f4f3f0] border border-[#e9e8e5]">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#1b1c1a] block">
                  Analyzer diagnostic logs
                </span>
                <span className="text-[11px] text-[#75777a] block">
                  Stream raw solc, AST traversal, and Foundry telemetry in the console drawer.
                </span>
              </div>
              <input
                type="checkbox"
                checked={analyzerLogs}
                onChange={(e) => setAnalyzerLogs(e.target.checked)}
                className="w-4 h-4 accent-[#37675d] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#f4f3f0] border border-[#e9e8e5]">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-[#1b1c1a] block">
                  Real-time invariant alerts &amp; notifications
                </span>
                <span className="text-[11px] text-[#75777a] block">
                  Receive browser notifications when differential test suites complete.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 accent-[#37675d] cursor-pointer"
              />
            </div>

            <div className="pt-space-xs">
              <button
                onClick={handleSaveWorkspace}
                className="px-space-md py-2 bg-[#000000] hover:bg-[#191c1f] text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: DANGER ZONE */}
        {activeTab === 'danger' && (
          <div className="space-y-space-md max-w-xl">
            <div className="p-space-md rounded-lg border border-[#e9e8e5] bg-[#faf9f6] space-y-2">
              <h3 className="font-headline-sm text-sm font-semibold text-[#1b1c1a]">
                Export Workspace Data
              </h3>
              <p className="text-xs text-[#75777a]">
                Download a cryptographically structured JSON bundle containing all analyzed contracts, patches, AST diffs, and verification run logs.
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-space-md py-1.5 bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1b1c1a] rounded-lg text-xs font-semibold transition-colors border border-[#e3e2df] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Workspace JSON</span>
              </button>
            </div>

            <div className="p-space-md rounded-lg border border-[#ba1a1a]/30 bg-[#ffdad6]/15 space-y-2">
              <h3 className="font-headline-sm text-sm font-semibold text-[#ba1a1a]">
                Delete Workspace
              </h3>
              <p className="text-xs text-[#75777a]">
                Permanently purge all contract revisions, verification test records, and security telemetry for this workspace. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteWorkspace}
                className="flex items-center gap-1.5 px-space-md py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                <span>Delete Workspace...</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
