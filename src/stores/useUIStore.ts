// src/stores/useUIStore.ts
// Store pour l'état de l'interface utilisateur

import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';
type Screen = 'loading' | 'onboarding' | 'home' | 'chat' | 'stats' | 'settings' | 'avatar';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  type: 'evolution' | 'achievement' | 'confirm' | 'info';
  title?: string;
  message?: string;
  data?: any;
}

interface UIStore {
  // Navigation
  currentScreen: Screen;
  previousScreen: Screen | null;
  
  // Thème
  theme: ThemeMode;
  
  // États UI
  isTyping: boolean;
  isGenerating: boolean;
  showDebugPanel: boolean;
  
  // Toasts
  toasts: Toast[];
  
  // Modals
  activeModal: Modal | null;
  
  // Keyboard
  keyboardVisible: boolean;
  keyboardHeight: number;
  
  // Actions navigation
  setScreen: (screen: Screen) => void;
  goBack: () => void;
  
  // Actions thème
  setTheme: (theme: ThemeMode) => void;
  
  // Actions états
  setTyping: (isTyping: boolean) => void;
  setGenerating: (isGenerating: boolean) => void;
  toggleDebugPanel: () => void;
  
  // Actions toasts
  showToast: (type: Toast['type'], message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  
  // Actions modals
  showModal: (modal: Omit<Modal, 'id'>) => void;
  hideModal: () => void;
  
  // Actions keyboard
  setKeyboardVisible: (visible: boolean, height?: number) => void;
  
  // Reset
  reset: () => void;
}

let toastCounter = 0;

export const useUIStore = create<UIStore>((set, get) => ({
  // État initial
  currentScreen: 'loading',
  previousScreen: null,
  theme: 'system',
  isTyping: false,
  isGenerating: false,
  showDebugPanel: false,
  toasts: [],
  activeModal: null,
  keyboardVisible: false,
  keyboardHeight: 0,

  // Navigation
  setScreen: (screen: Screen) => {
    const { currentScreen } = get();
    set({
      previousScreen: currentScreen,
      currentScreen: screen,
    });
  },

  goBack: () => {
    const { previousScreen } = get();
    if (previousScreen) {
      set({
        currentScreen: previousScreen,
        previousScreen: null,
      });
    }
  },

  // Thème
  setTheme: (theme: ThemeMode) => {
    set({ theme });
  },

  // États
  setTyping: (isTyping: boolean) => {
    set({ isTyping });
  },

  setGenerating: (isGenerating: boolean) => {
    set({ isGenerating });
  },

  toggleDebugPanel: () => {
    set({ showDebugPanel: !get().showDebugPanel });
  },

  // Toasts
  showToast: (type: Toast['type'], message: string, duration = 3000) => {
    const id = `toast_${++toastCounter}`;
    const toast: Toast = { id, type, message, duration };

    set({ toasts: [...get().toasts, toast] });

    // Auto-hide après la durée
    if (duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, duration);
    }
  },

  hideToast: (id: string) => {
    set({ toasts: get().toasts.filter(t => t.id !== id) });
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modals
  showModal: (modal: Omit<Modal, 'id'>) => {
    const id = `modal_${Date.now()}`;
    set({ activeModal: { ...modal, id } });
  },

  hideModal: () => {
    set({ activeModal: null });
  },

  // Keyboard
  setKeyboardVisible: (visible: boolean, height = 0) => {
    set({
      keyboardVisible: visible,
      keyboardHeight: height,
    });
  },

  // Reset
  reset: () => {
    set({
      currentScreen: 'loading',
      previousScreen: null,
      isTyping: false,
      isGenerating: false,
      toasts: [],
      activeModal: null,
      keyboardVisible: false,
      keyboardHeight: 0,
    });
  },
}));

// Hooks utilitaires
export const useIsLoading = () => useUIStore(state => state.isGenerating || state.isTyping);
export const useCurrentScreen = () => useUIStore(state => state.currentScreen);
export const useTheme = () => useUIStore(state => state.theme);

export default useUIStore;
