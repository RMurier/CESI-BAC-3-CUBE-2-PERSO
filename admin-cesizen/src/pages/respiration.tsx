import { useEffect, useState } from 'react'
import { ExerciceRespiration } from '../interfaces/exerciceRespiration'

type ActionType = 'INSPIRER' | 'EXPIRER' | 'RETENIR'

interface ActionForm {
  ordre: number
  type: ActionType
  dureeSecondes: number
}

export default function ExerciceRespirationPage() {
  const [exercices, setExercices] = useState<ExerciceRespiration[]>([])
  const [form, setForm] = useState({ nom: '', description: '', bienfait: '', icone: '' })
  const [actions, setActions] = useState<ActionForm[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const fetchExercices = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/respiration/admin`)
    const data = await res.json()
    setExercices(data)
  }

  const handleAddAction = () => {
    setActions([...actions, { ordre: actions.length + 1, type: 'INSPIRER', dureeSecondes: 4 }])
  }

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index).map((a, i) => ({ ...a, ordre: i + 1 })))
  }

  const handleEdit = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/respiration/${id}`)
    const data = await res.json()
    setForm({ nom: data.nom, description: data.description, bienfait: data.bienfait, icone: data.icone })
    setActions(data.actions)
    setEditId(id)
    setShowModal(true)
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/respiration/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchExercices()
  }

  const handleSubmit = async () => {
    const method = editId ? 'PATCH' : 'POST'
    const url = editId
      ? `${import.meta.env.VITE_API_BASE_ADDRESS}/api/respiration/${editId}`
      : `${import.meta.env.VITE_API_BASE_ADDRESS}/api/respiration`

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, actions }),
    })

    setForm({ nom: '', description: '', bienfait: '', icone: '' })
    setActions([])
    setEditId(null)
    setShowModal(false)
    fetchExercices()
  }

  useEffect(() => {
    fetchExercices()
  }, [])

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Exercices de respiration</h2>
  
      <button
        onClick={() => {
          setForm({ nom: '', description: '', bienfait: '', icone: '' })
          setActions([])
          setEditId(null)
          setShowModal(true)
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter un exercice
      </button>
  
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 whitespace-nowrap">Nom</th>
              <th className="p-2 whitespace-nowrap">Description</th>
              <th className="p-2 whitespace-nowrap">Bienfait</th>
              <th className="p-2 whitespace-nowrap">Icône</th>
              <th className="p-2 whitespace-nowrap">Statut</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercices.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2 break-words">{e.nom}</td>
                <td className="p-2 break-words">{e.description}</td>
                <td className="p-2 break-words">{e.bienfait}</td>
                <td className="p-2 break-words">{e.icone}</td>
                <td className="p-2 text-sm">{e.isActive ? 'Actif' : 'Désactivé'}</td>
                <td className="p-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEdit(e.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleToggleActive(e.id, e.isActive)}
                    className={`px-2 py-1 rounded text-sm ${e.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    {e.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl space-y-4">
            <h3 className="text-xl font-semibold">
              {editId ? 'Modifier un exercice' : 'Nouvel exercice'}
            </h3>
  
            {['nom', 'description', 'bienfait', 'icone'].map((f) => (
              <input
                key={f}
                type="text"
                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={(form as any)[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="border rounded px-3 py-2 w-full"
              />
            ))}
  
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold">Actions</h4>
                <button
                  onClick={handleAddAction}
                  className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  + Ajouter
                </button>
              </div>
  
              {actions.map((a, i) => (
                <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                  <span className="text-sm w-5 text-gray-500">{i + 1}.</span>
                  <select
                    value={a.type}
                    onChange={(e) => {
                      const updated = [...actions]
                      updated[i].type = e.target.value as ActionType
                      setActions(updated)
                    }}
                    className="border rounded px-2 py-1 flex-1"
                  >
                    <option value="INSPIRER">Inspirer</option>
                    <option value="EXPIRER">Expirer</option>
                    <option value="RETENIR">Retenir</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={a.dureeSecondes}
                    onChange={(e) => {
                      const updated = [...actions]
                      updated[i].dureeSecondes = Number(e.target.value)
                      setActions(updated)
                    }}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <span className="text-sm text-gray-600">secondes</span>
                  <button
                    onClick={() => handleRemoveAction(i)}
                    className="text-red-600 hover:underline text-sm ml-auto"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
  
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
              >
                {editId ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}