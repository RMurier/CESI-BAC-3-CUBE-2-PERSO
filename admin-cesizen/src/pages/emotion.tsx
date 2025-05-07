import { useEffect, useState } from 'react'
import { Emotion } from '../interfaces/emotion'

export default function EmotionsPage() {
  const [emotions, setEmotions] = useState<Emotion[]>([])
  const [edit, setEdit] = useState<Emotion | null>(null)
  const [form, setForm] = useState({ nom: '', description: '', niveau: 1, icon: '' })
  const [showModal, setShowModal] = useState(false)

  const fetchEmotions = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/emotions`)
    const data = await res.json()
    setEmotions(data)
  }

  const openModal = (emotion?: Emotion) => {
    if (emotion) {
      setEdit(emotion)
      setForm({
        nom: emotion.nom,
        description: emotion.description,
        niveau: emotion.niveau,
        icon: emotion.icon,
      })
    } else {
      setEdit(null)
      setForm({ nom: '', description: '', niveau: 1, icon: '' })
    }
    setShowModal(true)
  }

  const handleSubmit = async () => {
    const method = edit ? 'PATCH' : 'POST'
    const url = edit
      ? `${import.meta.env.VITE_API_BASE_ADDRESS}/api/emotions/${edit.id}`
      : `${import.meta.env.VITE_API_BASE_ADDRESS}/api/emotions`

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setShowModal(false)
    fetchEmotions()
  }

  useEffect(() => {
    fetchEmotions()
  }, [])

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Émotions</h2>

      <button
        onClick={() => openModal()}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter une émotion
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 whitespace-nowrap">Nom</th>
              <th className="p-2 whitespace-nowrap">Description</th>
              <th className="p-2 whitespace-nowrap">Niveau</th>
              <th className="p-2 whitespace-nowrap">Icône</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emotions.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2 break-words">{e.nom}</td>
                <td className="p-2 break-words">{e.description}</td>
                <td className="p-2">{e.niveau}</td>
                <td className="p-2 break-words">{e.icon}</td>
                <td className="p-2">
                  <button
                    onClick={() => openModal(e)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm w-full"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold">
              {edit ? 'Modifier une émotion' : 'Ajouter une émotion'}
            </h3>
            <input
              type="text"
              placeholder="Nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Icône"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <select
              value={form.niveau}
              onChange={(e) => setForm({ ...form, niveau: Number(e.target.value) })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value={1}>Niveau 1</option>
              <option value={2}>Niveau 2</option>
            </select>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
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
                {edit ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
