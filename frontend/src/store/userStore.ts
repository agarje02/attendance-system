import { create } from 'zustand';
import { getAuthUser, type AuthUser } from '@/lib/auth';

interface UserState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  
  fetchUser: async () => {
    // Don't fetch if already initialized and user exists
    if (useUserStore.getState().isInitialized && useUserStore.getState().user) {
      return;
    }
    
    set({ isLoading: true });
    try {
      const user = await getAuthUser();
      set({ user, isLoading: false, isInitialized: true });
    } catch (error) {
      set({ user: null, isLoading: false, isInitialized: true });
    }
  },
  
  setUser: (user: AuthUser | null) => set({ user }),
  
  clearUser: () => set({ user: null, isInitialized: false }),
}));
