import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  role: "patient" | "doctor";
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: (
    email: string,
    password: string,
    role: "patient" | "doctor",
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: "patient" | "doctor",
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          setUser({
            id: session.user.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role,
          });
        }
      }

      setIsLoading(false);
    };

    checkSession();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileData) {
          setUser({
            id: session.user.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "patient" | "doctor",
  ) => {
    try {
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user data returned");

      // Create profile record
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          name,
          email,
          role,
        })
        .select();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Don't throw here, continue with the process
      }

      // Create role-specific record
      const table = role === "patient" ? "patients" : "doctors";
      const { error: roleError } = await supabase
        .from(table)
        .insert({
          user_id: authData.user.id,
          name,
          email,
          role,
        })
        .select();

      if (roleError) {
        console.error(`${role} record creation error:`, roleError);
        // Don't throw here, continue with the process
      }

      // For development purposes, we'll set the user immediately
      // In production, you'd typically wait for email confirmation
      setUser({
        id: authData.user.id,
        name,
        email,
        role,
      });

      return;
    } catch (error) {
      console.error("SignUp error:", error);
      throw error;
    }
  };

  const signIn = async (
    email: string,
    password: string,
    role: "patient" | "doctor",
  ) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      if (authData.user) {
        // Try to get profile data, but don't fail if it doesn't exist yet
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          // If profile doesn't exist, create it
          if (profileError.code === "PGRST116") {
            const userData = authData.user.user_metadata || {};
            const userName = userData.name || email.split("@")[0];

            await supabase
              .from("profiles")
              .insert({
                id: authData.user.id,
                name: userName,
                email: authData.user.email,
                role: role,
              })
              .select();

            // Also create role-specific record
            const table = role === "patient" ? "patients" : "doctors";
            await supabase
              .from(table)
              .insert({
                user_id: authData.user.id,
                name: userName,
                email: authData.user.email,
                role: role,
              })
              .select();

            setUser({
              id: authData.user.id,
              name: userName,
              email: authData.user.email || "",
              role: role,
            });

            return;
          } else {
            throw profileError;
          }
        }

        // If we have profile data, verify the role matches
        if (profileData && profileData.role !== role) {
          await supabase.auth.signOut();
          throw new Error(`You are not registered as a ${role}`);
        }

        setUser({
          id: authData.user.id,
          name: profileData?.name || "",
          email: profileData?.email || "",
          role: profileData?.role || role,
        });
      }
    } catch (error) {
      console.error("SignIn error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useCustomAuth = useAuth;
