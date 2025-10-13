import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface CommunityProfile {
  id: string
  user_id: string
  headline: string
  bio: string | null
  budget_per_person: number | null
  preferred_areas: string[] | null
  move_in_date: string | null
  duration_months: number | null
  gender_preference: string | null
  occupation: string | null
  work_pattern: string | null
  has_pets: boolean
  is_smoker: boolean
  status: string
  community_groups: string[]
  created_at: string
  nationality?: string
  identity_verified?: boolean
}

interface CommunityConnection {
  id: string
  requester_id: string
  target_id: string
  status: string
  message: string | null
  created_at: string
  updated_at: string
}

export const useCommunityData = () => {
  const [profiles, setProfiles] = useState<CommunityProfile[]>([])
  const [connections, setConnections] = useState<CommunityConnection[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('community_profile_cards')
        .select(`
          *,
          profiles!inner(nationality, identity_verified)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedProfiles = data?.map((profile: any) => ({
        ...profile,
        nationality: profile.profiles?.nationality,
        identity_verified: profile.profiles?.identity_verified || false,
      })) || []

      setProfiles(formattedProfiles)
    } catch (error) {
      console.error('Error fetching community profiles:', error)
    }
  }

  const fetchConnections = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_connections')
        .select('*')
        .or(`requester_id.eq.${userId},target_id.eq.${userId}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setConnections(data || [])
    } catch (error) {
      console.error('Error fetching connections:', error)
    }
  }

  const createConnection = async (targetUserId: string, message: string, currentUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_connections')
        .insert({
          requester_id: currentUserId,
          target_id: targetUserId,
          message: message.trim(),
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      
      // Add to local state
      if (data) {
        setConnections(prev => [data, ...prev])
      }
      
      return { success: true, data }
    } catch (error: any) {
      console.error('Error creating connection:', error)
      return { success: false, error: error.message }
    }
  }

  const updateConnectionStatus = async (connectionId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('community_connections')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', connectionId)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      if (data) {
        setConnections(prev => prev.map(conn => 
          conn.id === connectionId ? data : conn
        ))
      }
      
      return { success: true, data }
    } catch (error: any) {
      console.error('Error updating connection:', error)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchProfiles()
      setLoading(false)
    }

    loadData()
  }, [])

  return {
    profiles,
    connections,
    loading,
    fetchProfiles,
    fetchConnections,
    createConnection,
    updateConnectionStatus,
    refetch: fetchProfiles,
  }
}