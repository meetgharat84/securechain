import type { UserDoc } from '../server/models';
import { db } from '../server/db';
import { AVATAR_URL } from '../data/mockData';

const AUTH_STORAGE_KEY = 'securechain_auth_session';
const REMEMBER_ME_KEY = 'securechain_remember_me';

/**
 * Isolated prototype demo mode flag.
 * In production/real session mode, this is false.
 */
export const DEMO_MODE = false;

export const DEFAULT_AUDITOR_USER: UserDoc = {
  _id: 'usr_lead_auditor',
  name: 'Lead Protocol Auditor',
  email: 'sec@securechain.ai',
  avatar: AVATAR_URL,
  role: 'Principal Security Architect',
  workspaceId: 'ws_default_01',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

export interface AuthState {
  isAuthenticated: boolean;
  user: UserDoc | null;
  token: string | null;
}

/**
 * Derive initials from name or email for user avatar badge
 */
export const getUserInitials = (name?: string, email?: string): string => {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().slice(0, 2).toUpperCase();
  }
  return 'SC';
};

export class AuthService {
  private static listeners: Set<(state: AuthState) => void> = new Set();

  /**
   * Derive a clean display name from an email address (e.g. test@example.com -> Test)
   */
  public static deriveNameFromEmail(email: string): string {
    if (!email || !email.includes('@')) return 'Auditor';
    const local = email.split('@')[0];
    const cleaned = local.replace(/[._+-]/g, ' ').trim();
    if (!cleaned) return 'Auditor';
    return cleaned
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Subscribe to authentication state changes
   */
  public static subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify(state: AuthState) {
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    });
  }

  /**
   * Check if user is currently authenticated
   */
  public static isAuthenticated(): boolean {
    return this.getStoredState().isAuthenticated;
  }

  /**
   * Retrieve current authenticated user
   */
  public static getCurrentUser(): UserDoc | null {
    return this.getStoredState().user;
  }

  /**
   * Get current auth state from localStorage or sessionStorage
   */
  public static getStoredState(): AuthState {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false, user: null, token: null };
    }

    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.isAuthenticated && parsed?.user) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse error
    }

    if (DEMO_MODE) {
      return {
        isAuthenticated: true,
        user: DEFAULT_AUDITOR_USER,
        token: 'demo_token_prototype',
      };
    }

    return { isAuthenticated: false, user: null, token: null };
  }

  /**
   * Validate email format
   */
  public static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /**
   * Sign in with email and password
   */
  public static async login(
    email: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<UserDoc> {
    const trimmedEmail = email.trim();

    // 1. Validation checks
    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!this.isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    // Network error simulation flag for testing
    if (trimmedEmail.toLowerCase() === 'error@network.com' || trimmedEmail.toLowerCase() === 'network@error.com') {
      await new Promise((r) => setTimeout(r, 600));
      throw new Error('Unable to connect. Please try again.');
    }

    // Invalid credentials simulation (test accounts can trigger this)
    if (password === 'wrong' || password === 'invalid' || password === 'error') {
      await new Promise((r) => setTimeout(r, 500));
      throw new Error('The email or password is incorrect.');
    }

    // Simulate realistic network latency for cryptographic handshake
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Resolve or create user document
    let user: UserDoc;
    if (trimmedEmail.toLowerCase() === DEFAULT_AUDITOR_USER.email.toLowerCase()) {
      user = DEFAULT_AUDITOR_USER;
    } else {
      // Find existing user in db or generate user profile from email
      const existingUser = Array.from(db.users.values()).find(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (existingUser) {
        user = existingUser;
      } else {
        const id = 'usr_' + Math.random().toString(36).substring(2, 9);
        const derivedName = this.deriveNameFromEmail(trimmedEmail);

        user = {
          _id: id,
          name: derivedName,
          email: trimmedEmail,
          avatar: '',
          role: 'Smart Contract Security Auditor',
          workspaceId: 'ws_default_01',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        db.saveUser(user);
      }
    }

    const state: AuthState = {
      isAuthenticated: true,
      user,
      token: 'jwt_sec_' + Math.random().toString(36).substring(2, 16),
    };

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    this.notify(state);
    return user;
  }

  /**
   * Register a new account
   */
  public static async register(
    name: string,
    email: string,
    password: string,
    role: string = 'Smart Contract Auditor'
  ): Promise<UserDoc> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      throw new Error('Please enter your full name.');
    }
    if (!trimmedEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!this.isValidEmail(trimmedEmail)) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password) {
      throw new Error('Please enter a password.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    await new Promise((resolve) => setTimeout(resolve, 700));

    const id = 'usr_' + Math.random().toString(36).substring(2, 9);
    const user: UserDoc = {
      _id: id,
      name: trimmedName,
      email: trimmedEmail,
      avatar: '',
      role,
      workspaceId: 'ws_default_01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.saveUser(user);

    const state: AuthState = {
      isAuthenticated: true,
      user,
      token: 'jwt_sec_' + Math.random().toString(36).substring(2, 16),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(REMEMBER_ME_KEY, 'true');

    this.notify(state);
    return user;
  }

  /**
   * Update the current authenticated user profile
   */
  public static updateCurrentUser(updatedFields: Partial<UserDoc>): UserDoc {
    const current = this.getCurrentUser();
    if (!current) {
      throw new Error('No authenticated user session found.');
    }

    const updated: UserDoc = {
      ...current,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    db.saveUser(updated);

    const isRemembered = typeof window !== 'undefined' && localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    const state: AuthState = {
      isAuthenticated: true,
      user: updated,
      token: this.getStoredState().token || 'jwt_sec_' + Math.random().toString(36).substring(2, 16),
    };

    if (typeof window !== 'undefined') {
      if (isRemembered) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      }
    }

    this.notify(state);
    return updated;
  }

  /**
   * Sign out and clear stored session tokens
   */
  public static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    const state: AuthState = {
      isAuthenticated: false,
      user: null,
      token: null,
    };

    this.notify(state);
  }

  /**
   * Simulate forgot password reset email dispatch
   */
  public static async requestPasswordReset(email: string): Promise<void> {
    const trimmed = email.trim();
    if (!trimmed) {
      throw new Error('Please enter your email address.');
    }
    if (!this.isValidEmail(trimmed)) {
      throw new Error('Please enter a valid email address.');
    }

    await new Promise((r) => setTimeout(r, 600));
  }
}
