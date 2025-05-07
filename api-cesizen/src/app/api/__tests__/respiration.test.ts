import { GET as GET_Respiration } from '../respiration/route'
import { GET as GET_Respiration_admin } from '../respiration/admin/route'
import { GET as GET_Favoris } from '../respiration/user/[userId]/favoris/route'
import { GET as GET_Respiration_id } from '../respiration/[id]/route'
import { GET as GET_IsFavori } from '../respiration/[id]/is-favori/route'
import {
    POST as POST_RespirationFavori,
    DELETE as DELETE_RespirationFavori,
} from '../respiration/[id]/favori/route'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        exerciceRespiration: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        utilisateur: {
            findUnique: jest.fn(),
        },
        actionRespiration: {
            deleteMany: jest.fn(),
            createMany: jest.fn(),
        },
        favorisRespiration: {
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        }
    },
}))

describe('GET /api/respiration', () => {
    it('retourne la liste des exercices actifs', async () => {
        const mockExercices = [
            { id: '1', nom: 'Respiration profonde', description: 'Détente', bienfait: 'Relaxation', icone: '🧘', isActive: true },
            { id: '2', nom: 'Cohérence cardiaque', description: 'Calme', bienfait: 'Apaisement', icone: '❤️', isActive: true },
        ]

            ; (prisma.exerciceRespiration.findMany as jest.Mock).mockResolvedValue(mockExercices)

        const mockRequest = { url: 'http://localhost:3000/api/respiration' } as Request

        const response = await GET_Respiration(mockRequest as any)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockExercices)
    })

    it('retourne la liste filtrée par bienfait', async () => {
        const mockFiltered = [
            { id: '1', nom: 'Respiration relaxante', description: 'Calme', bienfait: 'sommeil', icone: '😴', isActive: true },
        ]

            ; (prisma.exerciceRespiration.findMany as jest.Mock).mockResolvedValue(mockFiltered)

        const mockRequest = { url: 'http://localhost:3000/api/respiration?bienfait=sommeil' } as Request

        const response = await GET_Respiration(mockRequest as any)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockFiltered)
        expect(prisma.exerciceRespiration.findMany).toHaveBeenCalledWith({
            where: {
                isActive: true,
                bienfait: {
                    contains: 'sommeil',
                    mode: 'insensitive',
                },
            },
            orderBy: { nom: 'asc' },
        })
    })
})

describe('GET /api/respiration/user/[userId]/favoris', () => {
    it('retourne les exercices de respiration favoris actifs', async () => {
        const userId = 'user123'

        const mockFavoris = [
            {
                exerciceRespiration: {
                    id: '1',
                    nom: 'Exercice 1',
                    isActive: true,
                },
            },
            {
                exerciceRespiration: {
                    id: '2',
                    nom: 'Exercice 2',
                    isActive: false,
                },
            },
        ]

        const utilisateurMock = {
            clerkUserId: userId,
            favoris: mockFavoris,
        }

            ; (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(utilisateurMock)

        const request = new Request(`http://localhost/api/respiration/user/${userId}/favoris`)

        const response = await GET_Favoris(request as any, { params: { userId } })
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual([
            { id: '1', nom: 'Exercice 1', isActive: true }
        ])
    })

    it('retourne une erreur 404 si utilisateur non trouvé', async () => {
        ; (prisma.utilisateur.findUnique as jest.Mock).mockResolvedValue(null)

        const response = await GET_Favoris({} as any, { params: { userId: 'notfound' } })
        const data = await response.json()

        expect(response.status).toBe(404)
        expect(data.erreur).toBe('Utilisateur non trouvé')
    })
})

describe('GET /api/respiration/admin', () => {
    it('retourne tous les exercices triés par nom', async () => {
        const mockData = [
            { id: '1', nom: 'Exercice B', bienfait: 'test' },
            { id: '2', nom: 'Exercice A', bienfait: 'autre' },
        ]

            ; (prisma.exerciceRespiration.findMany as jest.Mock).mockResolvedValue(mockData)

        const req = { url: 'http://localhost/api/respiration/admin' } as Request
        const res = await GET_Respiration_admin(req as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual(mockData)
    })

    it('filtre les exercices par bienfait', async () => {
        const mockFiltered = [
            { id: '3', nom: 'Exercice Sommeil', bienfait: 'sommeil' },
        ]

            ; (prisma.exerciceRespiration.findMany as jest.Mock).mockResolvedValue(mockFiltered)

        const req = { url: 'http://localhost/api/respiration/admin?bienfait=sommeil' } as Request
        const res = await GET_Respiration_admin(req as any)
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual(mockFiltered)
        expect(prisma.exerciceRespiration.findMany).toHaveBeenCalledWith({
            where: {
                bienfait: {
                    contains: 'sommeil',
                    mode: 'insensitive',
                },
            },
            orderBy: { nom: 'asc' },
        })
    })
})

describe('GET /api/respiration/:id', () => {
    it("retourne l'exercice avec ses actions ordonnées", async () => {
        const id = 'abc123'

        const mockExercice = {
            id,
            nom: 'Exercice test',
            description: 'test desc',
            bienfait: 'sommeil',
            icone: '🧘',
            actions: [
                { ordre: 1, type: 'INSPIRER', dureeSecondes: 4 },
                { ordre: 2, type: 'RETENIR', dureeSecondes: 2 },
            ],
        }

            ; (prisma.exerciceRespiration.findUnique as jest.Mock).mockResolvedValue(mockExercice)

        const request = new Request(`http://localhost/api/respiration/${id}`)

        const response = await GET_Respiration_id(request as any, { params: { id } })
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockExercice)
        expect(prisma.exerciceRespiration.findUnique).toHaveBeenCalledWith({
            where: { id },
            include: {
                actions: {
                    orderBy: { ordre: 'asc' },
                },
            },
        })
    })
})

describe('GET /api/respiration/:id/is-favori', () => {
    it('retourne true si le favori existe', async () => {
        const id = 'exo123'
        const userId = 'user456'

            ; (prisma.favorisRespiration.findUnique as jest.Mock).mockResolvedValue({
                refExerciceRespiration: id,
                refUtilisateur: userId,
            })

        const req = new Request(`http://localhost/api/respiration/${id}/is-favori?user=${userId}`)

        const res = await GET_IsFavori(req as any, { params: { id } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual({ isFavori: true })
    })

    it('retourne false si le favori n’existe pas', async () => {
        const id = 'exo789'
        const userId = 'user000'

            ; (prisma.favorisRespiration.findUnique as jest.Mock).mockResolvedValue(null)

        const req = new Request(`http://localhost/api/respiration/${id}/is-favori?user=${userId}`)

        const res = await GET_IsFavori(req as any, { params: { id } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual({ isFavori: false })
    })
})

describe('POST /api/respiration/:id/favori', () => {
    it('ajoute un favori si inexistant', async () => {
        const id = 'ex123'
        const userId = 'user456'

            ; (prisma.favorisRespiration.findUnique as jest.Mock).mockResolvedValue(null)
            ; (prisma.favorisRespiration.create as jest.Mock).mockResolvedValue({})

        const req = new Request(`http://localhost/api/respiration/${id}/favori`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: { 'Content-Type': 'application/json' },
        })

        const res = await POST_RespirationFavori(req as any, { params: { id } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toBe('Ajouté aux favoris')
        expect(prisma.favorisRespiration.create).toHaveBeenCalled()
    })

    it('retourne "Déjà en favori" si déjà présent', async () => {
        const id = 'ex123'
        const userId = 'user456'

            ; (prisma.favorisRespiration.findUnique as jest.Mock).mockResolvedValue({
                refUtilisateur: userId,
                refExerciceRespiration: id,
            })

        const req = new Request(`http://localhost/api/respiration/${id}/favori`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
            headers: { 'Content-Type': 'application/json' },
        })

        const res = await POST_RespirationFavori(req as any, { params: { id } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toBe('Déjà en favori')
    })
})

describe('DELETE /api/respiration/:id/favori', () => {
    it('supprime un favori existant', async () => {
        const id = 'exo42'
        const userId = 'user99'

            ; (prisma.favorisRespiration.delete as jest.Mock).mockResolvedValue({})

        const req = new Request('http://localhost/api/respiration/exo42/favori', {
            method: 'DELETE',
            body: JSON.stringify({ userId }),
            headers: { 'Content-Type': 'application/json' },
        })

        const res = await DELETE_RespirationFavori(req as any, { params: { id } })
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data.message).toBe('Supprimé des favoris')
        expect(prisma.favorisRespiration.delete).toHaveBeenCalledWith({
            where: {
                refUtilisateur_refExerciceRespiration: {
                    refUtilisateur: userId,
                    refExerciceRespiration: id,
                },
            },
        })
    })
})