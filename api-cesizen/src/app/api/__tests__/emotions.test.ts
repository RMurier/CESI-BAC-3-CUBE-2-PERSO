import { GET, POST } from '../emotions/route'
import {PATCH} from '../emotions/[id]/route'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        emotion: {
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    },
}))

describe('GET /api/emotions', () => {
    it('retourne la liste des émotions avec succès', async () => {
        const mockEmotions = [
            { id: 1, nom: 'Joie', description: 'Sentiment positif', niveau: 1, icon: 'joy' },
            { id: 2, nom: 'Tristesse', description: 'Sentiment négatif', niveau: 2, icon: 'joy' },
        ]
            ; (prisma.emotion.findMany as jest.Mock).mockResolvedValue(mockEmotions)

        const response = await GET({} as any)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockEmotions)
    })
})

describe('POST /api/emotions', () => {
    it('crée une émotion avec succès', async () => {
        const body = {
            nom: 'Joie',
            description: 'Émotion positive',
            icon: '😊',
            niveau: 1,
        }

        const mockCreated = { id: 1, ...body }

            ; (prisma.emotion.create as jest.Mock).mockResolvedValue(mockCreated)

        const request = new Request('http://localhost/api/emotions', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })

        const response = await POST(request as any)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toEqual(mockCreated)
        expect(prisma.emotion.create).toHaveBeenCalledWith({ data: body })
    })
})

describe('PATCH /api/emotions/:id', () => {
    it('met à jour une émotion avec succès', async () => {
      const id = '1'
      const body = {
        nom: 'Colère',
        description: 'Émotion intense',
        icon: '😡',
        niveau: 2,
      }
  
      const mockUpdated = { id, ...body }
  
      ;(prisma.emotion.update as jest.Mock).mockResolvedValue(mockUpdated)
  
      const request = new Request(`http://localhost/api/emotions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
  
      const response = await PATCH(request as any, { params: { id } })
      const data = await response.json()
  
      expect(response.status).toBe(200)
      expect(data).toEqual(mockUpdated)
      expect(prisma.emotion.update).toHaveBeenCalledWith({
        where: { id },
        data: body,
      })
    })
  })