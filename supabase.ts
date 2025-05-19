import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export type Profile = {
  id: string
  created_at?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  username: string
  type: 'client' | 'professional'
}

export type Professional = {
  id: string
  profile_id: string
  created_at?: string
  service_area: string
  service_radius: number
  travel_fee: number | null
  years_experience: string
  bio: string
  verified: boolean
}

export type Service = {
  id: string
  professional_id: string
  name: string
  price: number
  description: string
  is_custom: boolean
}

export type Booking = {
  id: string
  created_at?: string
  client_id: string
  professional_id: string
  service_id: string
  booking_date: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  location: string
  notes?: string
  total_amount: number
}

// Database API functions
export const api = {
  // Client profile functions
  createClientProfile: async (profile: Omit<Profile, 'id' | 'created_at' | 'type'>) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...profile, type: 'client' }])
      .select()
    
    if (error) throw error
    return data?.[0] as Profile
  },

  // Professional profile functions
  createProfessionalProfile: async (
    profile: Omit<Profile, 'id' | 'created_at' | 'type'>,
    professionalData: Omit<Professional, 'id' | 'profile_id' | 'created_at'>
  ) => {
    // Start a transaction by using supabase functions
    const { data, error } = await supabase.rpc('create_professional', {
      profile_data: { ...profile, type: 'professional' },
      professional_data: professionalData
    })

    if (error) throw error
    return data
  },

  addService: async (service: Omit<Service, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
    
    if (error) throw error
    return data?.[0] as Service
  },

  getProfessionals: async () => {
    const { data, error } = await supabase
      .from('professionals')
      .select(`
        *,
        profiles:profile_id(*)
      `)
      .eq('verified', true)
    
    if (error) throw error
    return data
  },

  getProfessionalServices: async (professionalId: string) => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('professional_id', professionalId)
    
    if (error) throw error
    return data as Service[]
  },

  getUserProfile: async (userId: string) => {
    try {
      // Fix for 406 errors - ensure proper filters and headers
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Better handling of single or no results
      
      if (error) {
        console.error('Profile fetch error:', error)
        
        // Fallback approach if the first attempt fails
        if (error.code === '406' || error.code === '403') {
          console.log('Attempting alternative profile fetch approach')
          const { data: altData, error: altError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone, username, type')
            .eq('id', userId)
            .maybeSingle()
          
          if (altError) throw altError
          return altData as Profile
        }
        
        throw error
      }
      
      // If running in demo mode, return mock data
      if (window.location.search.includes('demo=true')) {
        return {
          id: userId,
          first_name: 'Demo',
          last_name: 'User',
          email: 'demo@example.com',
          phone: '555-123-4567',
          username: 'demouser',
          type: window.location.pathname.includes('/professional') ? 'professional' : 'client'
        } as Profile
      }
      
      return data as Profile
    } catch (error) {
      console.error('Final profile fetch error:', error)
      throw error
    }
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
    
    if (error) throw error
    return data?.[0] as Booking
  },

  getClientBookings: async (clientId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        professional:professional_id(
          *,
          profile:profile_id(*)
        ),
        service:service_id(*)
      `)
      .eq('client_id', clientId)
    
    if (error) throw error
    return data
  },

  getProfessionalBookings: async (professionalId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        client:client_id(
          *
        ),
        service:service_id(*)
      `)
      .eq('professional_id', professionalId)
    
    if (error) throw error
    return data
  },

  updateBookingStatus: async (bookingId: string, status: Booking['status']) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
    
    if (error) throw error
    return data?.[0] as Booking
  }
}

// Auth functions
export const auth = {
  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  // Get current user
  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  }
}

export default supabase 