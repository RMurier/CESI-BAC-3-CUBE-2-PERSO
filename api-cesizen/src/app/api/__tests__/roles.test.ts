import { GET } from '../roles/route'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    role: {
      findMany: jest.fn(),
    },
  },
}))

describe('GET /api/roles', () => {
  it('retourne la liste des rôles', async () => {
    const mockRoles = [
      { id: '1', nom: 'Administrateur', description: 'Gestion complète' },
      { id: '2', nom: 'Utilisateur', description: 'Accès limité' },
    ]

    ;(prisma.role.findMany as jest.Mock).mockResolvedValue(mockRoles)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockRoles)
  })
})
