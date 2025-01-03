import { Session, User } from '@supabase/supabase-js';
import { Channel as ChannelType } from 'stream-chat';
import { create } from 'zustand';

import { supabase } from '~/lib/supabase';

type State = {
  channel: ChannelType | null;
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

type Actions = {
  setChannel: (channel: ChannelType | null) => void;
  setSession: (session: Session | null) => void;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
};

const useStore = create<State & Actions>((set) => ({
  // Channel state
  channel: null,
  setChannel: (channel) => set({ channel }),

  // Auth state
  session: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  // Auth actions
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
    }),

  initializeAuth: async () => {
    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        isLoading: false,
      });

      // Setup auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      isAuthenticated: false,
      channel: null, // Clear chat state as well
    });
  },
}));

export default useStore;
