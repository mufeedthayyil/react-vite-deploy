import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export interface AuthUser extends User {
  profile?: UserProfile
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser({ ...authUser, profile: profile || undefined })
    } catch (error) {
      // If no profile exists, create one
      if (error?.code === 'PGRST116' || !error) {
        try {
          const { data: newProfile } = await supabase
            .from('user_profiles')
            .insert({
              id: authUser.id,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              email: authUser.email || '',
              role: 'customer'
            })
            .select()
            .single()
          
          setUser({ ...authUser, profile: newProfile })
        } catch (insertError) {
          console.error('Error creating user profile:', insertError)
          setUser(authUser)
        }
      } else {
        console.error('Error fetching user profile:', error)
        setUser(authUser)
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const isAdmin = user?.profile?.role === 'admin'
  const isStaff = user?.profile?.role === 'staff' || isAdmin

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isStaff,
    isAuthenticated: !!user,
  }
}