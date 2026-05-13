import { createStore } from "./store";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
}

const STORAGE_KEY = "pb-auth";

const readInitial = (): AuthState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null };
    const parsed = JSON.parse(raw) as AuthState;
    return {
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
    };
  } catch {
    return { user: null, accessToken: null };
  }
};

const persist = (state: AuthState) => {
  try {
    if (state.user && state.accessToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore — quota / private mode
  }
};

export const authStore = createStore<AuthState>(readInitial());

// Keep localStorage in sync on every change.
authStore.subscribe((s) => persist(s));

export const setSession = (user: AuthUser, accessToken: string) => {
  authStore.set({ user, accessToken });
};

export const clearSession = () => {
  authStore.set({ user: null, accessToken: null });
};

export const getAccessToken = (): string | null => authStore.get().accessToken;
export const getCurrentUser = (): AuthUser | null => authStore.get().user;
export const isAuthenticated = (): boolean =>
  authStore.get().accessToken !== null;
