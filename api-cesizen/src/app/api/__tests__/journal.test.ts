import {
  GET as GET_JournalById,
} from '../journal/[id]/route'
import {
  GET as GET_JournalByUser,
} from '../journal/user/[id]/route'
import {
  GET as GET_TodayJournal,
} from '../journal/user/[id]/today/route'
import {
  GET as GET_RapportJournal,
} from '../journal/user/[id]/rapport/route'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    journalEmotionnel: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}))

describe('GET /api/journal/[id]', () => {
  it('retourne le journal correspondant à un ID', async () => {
    const id = 'journal123'
    const mockJournal = { id, date: '2024-01-01', contenu: 'test' }

    ;(prisma.journalEmotionnel.findFirst as jest.Mock).mockResolvedValue(mockJournal)

    const req = new Request(`http://localhost/api/journal/${id}`)
    const res = await GET_JournalById(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockJournal)
  })
})

describe('GET /api/journal/user/:id', () => {
  it('retourne tous les journaux liés à un utilisateur', async () => {
    const id = 'user123'
    const mockJournaux = [
      { id: 'j1', contenu: 'ok' },
      { id: 'j2', contenu: 'bien' },
    ]

    ;(prisma.journalEmotionnel.findMany as jest.Mock).mockResolvedValue(mockJournaux)

    const req = new Request(`http://localhost/api/journal/user/${id}`)
    const res = await GET_JournalByUser(req as any, { params: { clerkUserId: id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockJournaux)
  })
})

describe('GET /api/journal/user/:id/today', () => {
  it('retourne le journal du jour pour un utilisateur', async () => {
    const id = 'user123'
    const mockJournal = { id: 'j3', contenu: 'aujourd’hui', date: new Date().toISOString() }

    ;(prisma.journalEmotionnel.findFirst as jest.Mock).mockResolvedValue(mockJournal)

    const req = new Request(`http://localhost/api/journal/user/${id}/today`)
    const res = await GET_TodayJournal(req as any, { params: { id } })
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data).toEqual(mockJournal)
  })
})