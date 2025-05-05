export interface Utilisateur {
    clerkUserId: string
    nom: string
    email: string
    isActive: boolean
    refRole: string
    role: {
      nom: string
      id: string
    }
  }