// auth.d.ts
declare module '#auth-utils' {
  interface User {
    id: string
    username: string
    email: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
    archived_at: string | null
    preferences: any
  }

  interface UserSession {
    created_at: string
    refreshed_at: string
    expires_at: string
  }

  interface SecureSesionData {
    id: string
    user_id: string
    created_at: string
    expires_at: string
    logged_out_at: string | null
  }
}

export {}
