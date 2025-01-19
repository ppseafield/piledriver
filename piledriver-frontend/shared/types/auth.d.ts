declare module '#auth-utils' {
  interface User {
    user_id: UUID
    username: string
    email: string | null
    created_at: Timestamp
    archived_at: Timestamp | null
    session_id: UUID | null
  }

  interface UserSession {
    user: User | null
    loggedInAt: Timestamp | null
  }

  interface SecureSessionData {
    bogusField1: string | null
    bogusField2: string | null
  }
}
