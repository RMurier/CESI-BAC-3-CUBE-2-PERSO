import { GET } from '../utilisateurs/route'
import { GET as GET_CheckUtilisateur } from '../utilisateurs/check/[clerkUserId]/route'
import {
  GET as GET_UtilisateurId,
  PATCH as PATCH_UtilisateurId,
} from '../utilisateurs/[id]/route'
import { GET as GET_IsAdminUtilisateur } from '../utilisateurs/[id]/is-admin/route'
import { GET as GET_AdminUtilisateur } from '../utilisateurs/[id]/admin/route'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    utilisateur: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
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

describe('GET /api/utilisateurs/check/:clerkUserId', () => {
  it('retourne isActive: true si l’utilisateur est actif', async () => {
    const clerkUserId = 'user123'

    ;(prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({
      isActive: true,
    })

    const req = new Request(`http://localhost/api/utilisateurs/check/${clerkUserId}`)

    const res = await GET_CheckUtilisateur(req, { params: { clerkUserId } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ isActive: true })
  })
})

describe('GET /api/utilisateurs/:id', () => {
  it('retourne l’utilisateur s’il existe', async () => {
    const id = 'user123'

    const mockUser = {
      clerkUserId: id,
      nom: 'Jean Dupont',
      email: 'jean@example.com',
      refRole: 'admin',
      isActive: true,
    }

    ;(prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const req = new Request(`http://localhost/api/utilisateurs/${id}`)

    const res = await GET_UtilisateurId(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockUser)
  })
})

describe('PATCH /api/utilisateurs/:id', () => {
  it('met à jour le nom et le rôle d’un utilisateur', async () => {
    const id = 'user456'
    const body = {
      nom: 'Alice',
      roleId: 'admin',
    }

    const updatedUser = {
      clerkUserId: id,
      nom: 'Alice',
      email: 'alice@example.com',
      refRole: 'admin',
      isActive: true,
      role: { id: 'admin', nom: 'Administrateur' },
    }

    ;(prisma.utilisateur.update as jest.Mock).mockResolvedValue(updatedUser)

    const req = new Request(`http://localhost/api/utilisateurs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await PATCH_UtilisateurId(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(updatedUser)
    expect(prisma.utilisateur.update).toHaveBeenCalledWith({
      where: { clerkUserId: id },
      data: {
        nom: 'Alice',
        refRole: 'admin',
      },
      include: { role: true },
    })
  })

  it('met à jour uniquement le statut isActive', async () => {
    const id = 'user789'
    const body = { isActive: false }

    const updatedUser = {
      clerkUserId: id,
      nom: 'Sam',
      email: 'sam@example.com',
      refRole: 'user',
      isActive: false,
      role: { id: 'user', nom: 'Utilisateur' },
    }

    ;(prisma.utilisateur.update as jest.Mock).mockResolvedValue(updatedUser)

    const req = new Request(`http://localhost/api/utilisateurs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await PATCH_UtilisateurId(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(updatedUser)
    expect(prisma.utilisateur.update).toHaveBeenCalledWith({
      where: { clerkUserId: id },
      data: {
        isActive: false,
      },
      include: { role: true },
    })
  })
})

describe('GET /api/utilisateurs/:id/is-admin', () => {
  it('retourne true si le rôle est Administrateur', async () => {
    const id = 'user-admin'

    ;(prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({
      clerkUserId: id,
      role: {
        nom: 'Administrateur',
      },
    })

    const req = new Request(`http://localhost/api/utilisateurs/${id}/is-admin`)

    const res = await GET_IsAdminUtilisateur(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ isAdmin: true })
  })

  it('retourne false si le rôle est Utilisateur', async () => {
    const id = 'user-nonadmin'

    ;(prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({
      clerkUserId: id,
      role: {
        nom: 'Utilisateur',
      },
    })

    const req = new Request(`http://localhost/api/utilisateurs/${id}/is-admin`)

    const res = await GET_IsAdminUtilisateur(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ isAdmin: false })
  })
})

describe('GET /api/utilisateurs/:id/admin', () => {
  it('retourne true si le rôle de l’utilisateur est Administrateur', async () => {
    const id = 'admin-user'

    ;(prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({
      clerkUserId: id,
      role: { nom: 'Administrateur' },
    })

    const req = new Request(`http://localhost/api/utilisateurs/${id}/admin`)
    const res = await GET_AdminUtilisateur(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ isAdmin: true })
  })

  it('retourne false si le rôle de l’utilisateur est Utilisateur', async () => {
    const id = 'regular-user'

    ;(prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue({
      clerkUserId: id,
      role: { nom: 'Utilisateur' },
    })

    const req = new Request(`http://localhost/api/utilisateurs/${id}/admin`)
    const res = await GET_AdminUtilisateur(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual({ isAdmin: false })
  })
})