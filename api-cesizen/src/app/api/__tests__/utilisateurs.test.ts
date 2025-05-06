import { GET } from '../utilisateurs/route'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/utilisateurs', () => {
  it('retourne la liste des utilisateurs avec succès', async () => {
    const mockUtilisateurs = [
      {
        clerkUserId: '123',
        nom: 'Jean Dupont',
        email: 'jean@cesizen.fr',
        refRole: 'admin',
        isActive: true,
        role: { nom: 'Administrateur' },
      },
    ]

    ;(prisma.utilisateur.findMany as jest.Mock).mockResolvedValue(mockUtilisateurs)

    const res = await GET()

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual(mockUtilisateurs)
  })
})
