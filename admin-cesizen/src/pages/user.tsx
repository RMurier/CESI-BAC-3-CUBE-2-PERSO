import { useEffect, useState } from 'react'
import { Utilisateur } from '../interfaces/utilisateur'
import { Role } from '../interfaces/role'

export default function UsersPage() {
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [roles, setRoles] = useState<Role[]>([])

  const fetchUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/utilisateurs`)
    const data = await res.json()
    setUsers(data)
  }

  const fetchRoles = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/roles`)
    const data = await res.json()
    setRoles(data)
  }

  const toggleActivation = async (clerkUserId: string, isActive: boolean) => {
    await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/utilisateurs/${clerkUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    })
    fetchUsers()
  }

  const handleRoleChange = async (clerkUserId: string, roleId: string) => {
    await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/utilisateurs/${clerkUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId }),
    })
    fetchUsers()
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Utilisateurs</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Nom</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Rôle</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.clerkUserId} className="border-t">
              <td className="p-2">{u.clerkUserId}</td>
              <td className="p-2">{u.nom}</td>
              <td className="p-2">{u.isActive ? 'Actif' : 'Désactivé'}</td>
              <td className="p-2">
                <select
                  value={u.refRole}
                  onChange={(e) => handleRoleChange(u.clerkUserId, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nom}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                {u.isActive ? (
                  <button
                    onClick={() => toggleActivation(u.clerkUserId, false)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Désactiver
                  </button>
                ) : (
                  <button
                    onClick={() => toggleActivation(u.clerkUserId, true)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Activer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
