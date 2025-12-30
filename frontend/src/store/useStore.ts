import { create } from "zustand";

interface AppState {
  // Navigation state
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;

  // Modal states
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;

  // User state (for future auth integration)
  user: null | { name: string; email: string };
  setUser: (user: null | { name: string; email: string }) => void;

  // UI preferences
  isScrolled: boolean;
  setScrolled: (scrolled: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Navigation
  isMenuOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

  // Modals
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true, isSignupModalOpen: false }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openSignupModal: () => set({ isSignupModalOpen: true, isLoginModalOpen: false }),
  closeSignupModal: () => set({ isSignupModalOpen: false }),

  // User
  user: null,
  setUser: (user) => set({ user }),

  // UI
  isScrolled: false,
  setScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));
