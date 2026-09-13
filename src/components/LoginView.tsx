import React, { useState, useEffect } from 'react';
import type { AppScreen } from '../types';
import { AuthService } from '../services/authService';
import { SecureChainFrameAnimation } from './SecureChainFrameAnimation';

interface LoginViewProps {
  initialMode?: 'login' | 'register';
  onNavigate: (screen: AppScreen, urlPath?: string) => void;
  onShowToast?: (message: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialMode = 'login',
  onNavigate,
  onShowToast,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  
  // Form input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and status state
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  // If already authenticated and visiting /login or /register, redirect to /app
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      onNavigate('overview', '/app');
    }
  }, [onNavigate]);

  // Validate fields on change if an error was previously shown
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError) {
      if (!val.trim()) {
        setEmailError('Please enter your email address.');
      } else if (!AuthService.isValidEmail(val)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError(null);
      }
    }
    if (formError) setFormError(null);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordError) {
      if (!val) {
        setPasswordError('Please enter your password.');
      } else {
        setPasswordError(null);
      }
    }
    if (formError) setFormError(null);
  };

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (nameError) {
      if (!val.trim()) {
        setNameError('Please enter your full name.');
      } else {
        setNameError(null);
      }
    }
    if (formError) setFormError(null);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setSocialNotice(null);

    let hasError = false;

    // Validate email
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError('Please enter your email address.');
      hasError = true;
    } else if (!AuthService.isValidEmail(cleanEmail)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError(null);
    }

    // Validate password
    if (mode !== 'forgot') {
      if (!password) {
        setPasswordError('Please enter your password.');
        hasError = true;
      } else {
        setPasswordError(null);
      }
    }

    // Validate name if register mode
    if (mode === 'register') {
      if (!fullName.trim()) {
        setNameError('Please enter your full name.');
        hasError = true;
      } else {
        setNameError(null);
      }
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        await AuthService.requestPasswordReset(cleanEmail);
        setFormSuccess('Password reset link has been dispatched to your email address.');
        setIsLoading(false);
        return;
      }

      if (mode === 'register') {
        const user = await AuthService.register(fullName, cleanEmail, password);
        setFormSuccess(`Account created for ${user.name}. Launching workspace...`);
        onShowToast?.(`Welcome to SecureChain AI, ${user.name}.`);
        setTimeout(() => {
          onNavigate('overview', '/app');
        }, 600);
        return;
      }

      // Default: Login mode
      const user = await AuthService.login(cleanEmail, password, rememberMe);
      setFormSuccess(`Authenticated as ${user.name}. Entering console...`);
      onShowToast?.(`Signed in successfully as ${user.name}.`);
      setTimeout(() => {
        onNavigate('overview', '/app');
      }, 500);
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setFormError(message);
    }
  };

  // 1-Click Demo Credentials Autofill
  const handleFillDemo = () => {
    setEmail('sec@securechain.ai');
    setPassword('auditor2026!');
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
  };

  // Social Auth Handler
  const handleSocialClick = (provider: 'Google' | 'GitHub') => {
    setSocialNotice(`${provider} single sign-on is scheduled for Enterprise Edition. Please sign in with email credentials.`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1b1c1a] flex flex-col font-sans selection:bg-[#37675d]/20 selection:text-[#1b1c1a]">
      {/* Editorial Minimal Top Navigation */}
      <header className="w-full bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e9e8e5] z-30">
        <div className="max-w-[1280px] mx-auto h-16 px-margin-mobile lg:px-margin-desktop flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing', '/')}
            className="flex items-center gap-space-xs cursor-pointer text-left group"
            title="Return to SecureChain AI Homepage"
          >
            <img
              src="/shield-logo.svg"
              alt="SecureChain AI Shield Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-headline-sm text-headline-sm text-[#1b1c1a] tracking-tight">
              SecureChain AI
            </span>
          </button>

          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => onNavigate('landing', '/')}
              className="inline-flex items-center gap-1 text-xs text-[#44474a] hover:text-[#1b1c1a] transition-colors font-medium px-space-xs py-1 rounded hover:bg-[#efeeeb]"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl lg:py-space-2xl flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-space-xl lg:gap-x-space-2xl items-center w-full">
          
          {/* LEFT PANEL: Brand Narrative, Verification Promise & Telemetry Visual */}
          <div className="lg:col-span-6 space-y-space-md lg:space-y-space-lg lg:pr-space-md">
            
            {/* Status & Eyebrow */}
            <div className="flex flex-wrap items-center gap-space-xs">
              <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-[#baede0]/40 border border-[#37675d]/20">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#37675d] animate-ping"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]/60"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#37675d]/40"></span>
                </div>
                <span className="font-code-sm text-code-sm text-[#1e4f46] font-medium">
                  Analyzer Ready
                </span>
              </div>

              <span className="text-xs font-mono uppercase tracking-wider text-[#75777a]">
                Analyzer-verified smart contract security
              </span>
            </div>

            {/* Main Editorial Heading */}
            <h1 className="font-display-hero text-3xl sm:text-4xl lg:text-[42px] leading-[1.15] text-[#1b1c1a] tracking-tight font-bold">
              Secure your contracts <br className="hidden sm:inline" />
              <span className="text-[#37675d]">before they secure a problem.</span>
            </h1>

            {/* Supporting Text */}
            <p className="font-body-base text-sm sm:text-base text-[#44474a] leading-relaxed max-w-lg">
              Analyze Solidity vulnerabilities, understand the exploit path, generate a patch, and verify whether the risk was actually removed.
            </p>

            {/* Product Promise Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#efeeeb] border border-[#e9e8e5] text-xs font-mono text-[#1b1c1a]">
              <span className="text-[#37675d] font-semibold">Detect</span>
              <span className="text-[#75777a]">→</span>
              <span className="text-[#37675d] font-semibold">Explain</span>
              <span className="text-[#75777a]">→</span>
              <span className="text-[#37675d] font-semibold">Fix</span>
              <span className="text-[#75777a]">→</span>
              <span className="text-[#37675d] font-semibold">Verify</span>
            </div>

            {/* Subtle Security Sculpture Frame Animation Visual */}
            <div className="hidden sm:block relative rounded-xl border border-[#e9e8e5] bg-[#ffffff] p-space-sm shadow-xs overflow-hidden max-w-md">
              <div className="flex items-center justify-between pb-2 border-b border-[#e9e8e5]/80 text-[11px] font-mono text-[#75777a]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#37675d]"></span>
                  <span>Solidity Formal Model Sandbox</span>
                </div>
                <span>solc 0.8.20</span>
              </div>
              <div className="h-44 w-full relative flex items-center justify-center bg-[#faf9f6] rounded-lg mt-2 overflow-hidden">
                <SecureChainFrameAnimation
                  className="w-full h-full max-h-44 object-contain"
                  overlayOpacity={0.06}
                  totalFrames={60}
                  fps={18}
                />
              </div>
              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-[#44474a]">
                <span>Invariant Verification Engine</span>
                <span className="text-[#37675d] font-semibold">Zero False Positives</span>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Authentication Panel */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#ffffff] rounded-2xl border border-[#e9e8e5] p-space-lg sm:p-space-xl shadow-xs space-y-space-md">
              
              {/* Card Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps text-[#37675d] uppercase tracking-wider font-semibold">
                    {mode === 'register' ? 'New Workspace' : mode === 'forgot' ? 'Recovery' : 'Welcome back'}
                  </span>
                  
                  {/* Mode switcher link */}
                  {mode === 'forgot' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setFormError(null);
                        setFormSuccess(null);
                      }}
                      className="text-xs text-[#37675d] hover:underline font-medium cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  ) : null}
                </div>

                <h2 className="font-headline-md text-xl sm:text-2xl font-bold text-[#1b1c1a] tracking-tight">
                  {mode === 'register' 
                    ? 'Create SecureChain AI Account' 
                    : mode === 'forgot'
                    ? 'Reset Workspace Password'
                    : 'Sign in to SecureChain AI'}
                </h2>

                <p className="font-body-base text-xs sm:text-sm text-[#44474a] leading-relaxed">
                  {mode === 'register'
                    ? 'Start analyzing Solidity smart contracts with verified automated patches.'
                    : mode === 'forgot'
                    ? 'Enter your verified email to receive cryptographic password reset instructions.'
                    : 'Continue analyzing contracts, reviewing findings, and verifying patches from your workspace.'}
                </p>
              </div>

              {/* Status Alert Banner (Form-level errors / success) */}
              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 rounded-lg bg-[#ffdad6]/40 border border-[#ba1a1a]/30 text-xs text-[#ba1a1a]"
                >
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div
                  role="status"
                  className="flex items-start gap-2 p-3 rounded-lg bg-[#baede0]/40 border border-[#37675d]/30 text-xs text-[#1e4f46]"
                >
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">check_circle</span>
                  <span>{formSuccess}</span>
                </div>
              )}

              {socialNotice && (
                <div
                  role="note"
                  className="flex items-start gap-2 p-3 rounded-lg bg-[#f4f3f0] border border-[#e3e2df] text-xs text-[#44474a]"
                >
                  <span className="material-symbols-outlined text-base text-[#75777a] shrink-0 mt-0.5">info</span>
                  <span>{socialNotice}</span>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleSubmit} noValidate className="space-y-space-md">
                
                {/* Full Name field (Register mode only) */}
                {mode === 'register' && (
                  <div className="space-y-1">
                    <label
                      htmlFor="auth-fullname"
                      className="block text-xs font-semibold text-[#1b1c1a]"
                    >
                      Full Name
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      name="fullname"
                      value={fullName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Lead Protocol Auditor"
                      disabled={isLoading}
                      aria-invalid={Boolean(nameError)}
                      aria-describedby={nameError ? 'name-error-msg' : undefined}
                      className={`w-full px-3 py-2 text-sm bg-[#faf9f6] border rounded-lg focus:outline-none transition-colors ${
                        nameError
                          ? 'border-[#ba1a1a] focus:border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30'
                          : 'border-[#e9e8e5] focus:border-[#37675d] focus:bg-[#ffffff]'
                      }`}
                    />
                    {nameError && (
                      <p id="name-error-msg" className="text-[11px] text-[#ba1a1a] flex items-center gap-1 pt-0.5">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {nameError}
                      </p>
                    )}
                  </div>
                )}

                {/* Email Address Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-semibold text-[#1b1c1a]"
                  >
                    Email address
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'email-error-msg' : undefined}
                    className={`w-full px-3 py-2 text-sm bg-[#faf9f6] border rounded-lg focus:outline-none transition-colors ${
                      emailError
                        ? 'border-[#ba1a1a] focus:border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30'
                        : 'border-[#e9e8e5] focus:border-[#37675d] focus:bg-[#ffffff]'
                    }`}
                  />
                  {emailError && (
                    <p id="email-error-msg" className="text-[11px] text-[#ba1a1a] flex items-center gap-1 pt-0.5">
                      <span className="material-symbols-outlined text-xs">error</span>
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Field (hidden in forgot mode) */}
                {mode !== 'forgot' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="auth-password"
                        className="block text-xs font-semibold text-[#1b1c1a]"
                      >
                        Password
                      </label>

                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setFormError(null);
                            setFormSuccess(null);
                            setSocialNotice(null);
                          }}
                          className="text-xs text-[#37675d] hover:underline font-medium cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        aria-invalid={Boolean(passwordError)}
                        aria-describedby={passwordError ? 'password-error-msg' : undefined}
                        className={`w-full px-3 py-2 pr-10 text-sm bg-[#faf9f6] border rounded-lg focus:outline-none transition-colors ${
                          passwordError
                            ? 'border-[#ba1a1a] focus:border-[#ba1a1a] ring-1 ring-[#ba1a1a]/30'
                            : 'border-[#e9e8e5] focus:border-[#37675d] focus:bg-[#ffffff]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#75777a] hover:text-[#1b1c1a] focus:outline-none transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {passwordError && (
                      <p id="password-error-msg" className="text-[11px] text-[#ba1a1a] flex items-center gap-1 pt-0.5">
                        <span className="material-symbols-outlined text-xs">error</span>
                        {passwordError}
                      </p>
                    )}
                  </div>
                )}

                {/* Remember Me Checkbox (Login mode only) */}
                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#44474a] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                        className="rounded border-[#e9e8e5] text-[#37675d] focus:ring-[#37675d] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>

                    {/* Fast Demo Credentials Helper Button */}
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="text-[11px] font-mono text-[#37675d] hover:text-[#1e4f46] hover:underline cursor-pointer"
                      title="Auto-fill verified demo auditor credentials"
                    >
                      Fill Demo Account
                    </button>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#000000] text-[#ffffff] rounded-lg font-headline-sm text-sm font-semibold hover:bg-[#191c1f] active:scale-[0.99] transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin"></span>
                      <span>
                        {mode === 'register' 
                          ? 'Creating workspace...' 
                          : mode === 'forgot'
                          ? 'Sending recovery link...'
                          : 'Signing in...'}
                      </span>
                    </>
                  ) : (
                    <span>
                      {mode === 'register' 
                        ? 'Create Account' 
                        : mode === 'forgot' 
                        ? 'Send Password Reset Link' 
                        : 'Sign In'}
                    </span>
                  )}
                </button>
              </form>

              {/* Social Login Divider & Options (Login and Register modes) */}
              {mode !== 'forgot' && (
                <>
                  <div className="relative flex items-center justify-center pt-2">
                    <div className="border-t border-[#e9e8e5] w-full"></div>
                    <span className="bg-[#ffffff] px-3 text-[11px] font-mono uppercase tracking-wider text-[#75777a] absolute">
                      or continue with
                    </span>
                  </div>

                  {/* Social Buttons */}
                  <div className="grid grid-cols-2 gap- space-xs gap-2 pt-2">
                    {/* Google Button */}
                    <button
                      type="button"
                      onClick={() => handleSocialClick('Google')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 py-2 px-3 border border-[#e9e8e5] rounded-lg bg-[#faf9f6] hover:bg-[#efeeeb] text-xs font-medium text-[#1b1c1a] transition-colors cursor-pointer"
                      title="Continue with Google"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Google</span>
                    </button>

                    {/* GitHub Button */}
                    <button
                      type="button"
                      onClick={() => handleSocialClick('GitHub')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 py-2 px-3 border border-[#e9e8e5] rounded-lg bg-[#faf9f6] hover:bg-[#efeeeb] text-xs font-medium text-[#1b1c1a] transition-colors cursor-pointer"
                      title="Continue with GitHub"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                      <span>GitHub</span>
                    </button>
                  </div>
                </>
              )}

              {/* Mode Toggle Link (Register / Login switch) */}
              <div className="text-center pt-2 text-xs text-[#44474a]">
                {mode === 'register' ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        onNavigate('login', '/login');
                      }}
                      className="text-[#37675d] font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p>
                    New to SecureChain AI?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        onNavigate('register', '/register');
                      }}
                      className="text-[#37675d] font-semibold hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </p>
                )}
              </div>

              {/* Legal Note */}
              <p className="text-[11px] text-[#75777a] text-center leading-relaxed pt-2 border-t border-[#e9e8e5]/60">
                By continuing, you agree to the SecureChain AI Terms of Service and Privacy Policy.
              </p>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
