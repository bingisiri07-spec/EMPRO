import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Persona, Role } from '../types';
import { DEMO_PERSONAS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  organizationMember: any | null;
  currentPersona: Persona;
  isLiveAuth: boolean;
  isLoading: boolean;
  authError: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchPersona: (persona: Persona) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [organizationMember, setOrganizationMember] = useState<any | null>(null);
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS.employee);
  const [isLiveAuth, setIsLiveAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Helper to construct a Persona object from a live Supabase profile and membership
  const constructPersonaFromProfile = (u: User, p: any, m: any): Persona => {
    const role: Role = (m?.role === 'manager' ? 'manager' : m?.role === 'hr' ? 'hr' : 'employee');
    const roleLabel = role === 'manager' ? 'Engineering Lead' : role === 'hr' ? 'People & Talent Lead' : 'Senior Cloud Architect';

    return {
      id: u.id,
      name: p?.full_name || u.email?.split('@')[0] || 'Authenticated User',
      email: u.email || '',
      role,
      roleLabel,
      avatar: p?.profile_photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`,
      designation: m?.designations?.designation_name || (role === 'manager' ? 'Tech Lead' : 'Staff Engineer'),
      department: m?.departments?.department_name || 'Engineering',
      employeeId: m?.employee_id || `EMP-${u.id.substring(0, 5).toUpperCase()}`,
      company: m?.organizations?.organization_name || 'Acme Technologies',
      companyId: m?.organization_id || 'org_acme',
      joinedDate: m?.joining_date || new Date().toISOString().split('T')[0],
      employmentStatus: 'Active',
      workEmail: u.email || '',
      personalEmail: u.email || '',
      location: 'San Francisco, CA / Remote',
    };
  };

  const fetchProfileAndMembership = async (userId: string, currentUser: User) => {
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // 2. Fetch Organization Member with details
      const { data: memberData } = await supabase
        .from('organization_members')
        .select('*, organizations(*), departments(*), designations(*)')
        .eq('profile_id', userId)
        .limit(1)
        .maybeSingle();

      setProfile(profileData || null);
      setOrganizationMember(memberData || null);

      if (profileData) {
        const livePersona = constructPersonaFromProfile(currentUser, profileData, memberData);
        setCurrentPersona(livePersona);
      }
    } catch (err) {
      console.warn('Could not load live profile:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsLiveAuth(true);
        fetchProfileAndMembership(session.user.id, session.user);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setIsLiveAuth(true);
        await fetchProfileAndMembership(newSession.user.id, newSession.user);
      } else {
        setIsLiveAuth(false);
        setProfile(null);
        setOrganizationMember(null);
        setCurrentPersona(DEMO_PERSONAS.employee);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase credentials are not configured in .env' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsLiveAuth(true);
        await fetchProfileAndMembership(data.user.id, data.user);
        setIsAuthModalOpen(false);
      }

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign in';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, role: Role = 'employee') => {
    setAuthError(null);
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase credentials are not configured in .env' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsLiveAuth(true);

        // Attempt creating profile record if not automatically created by triggers
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            updated_at: new Date().toISOString(),
          });
        } catch {
          // ignore if created via trigger
        }

        await fetchProfileAndMembership(data.user.id, data.user);
        setIsAuthModalOpen(false);
      }

      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Failed to sign up';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setOrganizationMember(null);
    setIsLiveAuth(false);
    setCurrentPersona(DEMO_PERSONAS.employee);
  };

  const switchPersona = (persona: Persona) => {
    // If user explicitly chooses a demo persona, switch to it
    setCurrentPersona(persona);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfileAndMembership(user.id, user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        organizationMember,
        currentPersona,
        isLiveAuth,
        isLoading,
        authError,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        signInWithEmail,
        signUpWithEmail,
        signOut,
        switchPersona,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
