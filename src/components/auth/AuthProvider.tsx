import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  role: "patient" | "doctor" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string, role: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch additional user data from your profiles table
        const { data: userData, error: userError } = await supabase
          .from('profiles')  // Changed from 'users' to 'profiles' based on your schema
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) throw userError;

        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name,
            role: userData.role,
            avatar: userData.avatar,
          });
          setIsSignedIn(true);
        }
      } else {
        setUser(null);
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUser();
      } else {
        setUser(null);
        setIsSignedIn(false);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string, role: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Verify the user's role matches what they selected
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
        
      if (userError) throw userError;
      
      if (userData.role !== role) {
        // If roles don't match, sign out and throw an error
        await supabase.auth.signOut();
        throw new Error(`Invalid role selected. You are registered as a ${userData.role}.`);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      setLoading(true);
      
      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");
      
      // 2. Create the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          role,
          email,
          created_at: new Date().toISOString(),
        });
      
      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        console.error("Error creating profile, cleaning up auth user");
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw profileError;
      }
      
      // 3. Return success
      return authData;
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isSignedIn,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Make sure to export the context if needed elsewhere
export { AuthContext };
