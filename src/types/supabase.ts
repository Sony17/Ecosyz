export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          supabaseId: string
          email: string
          name: string | null
          avatarUrl: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          supabaseId: string
          email: string
          name?: string | null
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          supabaseId?: string
          email?: string
          name?: string | null
          avatarUrl?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      profiles: {
        Row: {
          id: string
          userId: string
          displayName: string | null
          bio: string | null
          avatarUrl: string | null
        }
        Insert: {
          id?: string
          userId: string
          displayName?: string | null
          bio?: string | null
          avatarUrl?: string | null
        }
        Update: {
          id?: string
          userId?: string
          displayName?: string | null
          bio?: string | null
          avatarUrl?: string | null
        }
      }
    }
  }
}