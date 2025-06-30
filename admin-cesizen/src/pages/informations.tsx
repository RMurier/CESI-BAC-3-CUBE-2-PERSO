import { useEffect, useState } from 'react'

interface ContenuInformation {
  type: 'TEXTE' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  valeur: string
}

interface Information {
  id: string
  titre: string
  contenus: ContenuInformation[]
}

export default function InformationsAdminPage() {
  const [informations, setInformations] = useState<Information[]>([])
  const [form, setForm] = useState({ titre: '', type: 'TEXTE', valeur: '', file: null as File | null })
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const fetchInformations = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/informations`)
    const data = await res.json()
    setInformations(data)
  }

  const handleEdit = (info: Information) => {
    const contenu = info.contenus[0]
    setForm({
      titre: info.titre,
      type: contenu?.type || 'TEXTE',
      valeur: contenu?.valeur || '',
      file: null,
    })
    setEditId(info.id)
    setShowModal(true)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('titre', form.titre)
    formData.append('type', form.type)

    if (form.type === 'TEXTE') {
      formData.append('valeur', form.valeur)
    } else if (form.file) {
      formData.append('file', form.file)
    } else {
      alert('Veuillez sélectionner un fichier.')
      return
    }

    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `${import.meta.env.VITE_API_BASE_ADDRESS}/api/informations/${editId}` : `${import.meta.env.VITE_API_BASE_ADDRESS}/api/informations`

    await fetch(url, {
      method,
      body: formData,
    })

    setForm({ titre: '', type: 'TEXTE', valeur: '', file: null })
    setEditId(null)
    setShowModal(false)
    fetchInformations()
  }

  useEffect(() => {
    fetchInformations()
  }, [])

  return (
    <div className="pt-24 p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Informations</h2>

      <button
        onClick={() => {
          setForm({ titre: '', type: 'TEXTE', valeur: '', file: null })
          setEditId(null)
          setShowModal(true)
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ajouter une information
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 whitespace-nowrap">Titre</th>
              <th className="p-2 whitespace-nowrap">Contenu</th>
              <th className="p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {informations.map((info) => (
              <tr key={info.id} className="border-t">
                <td className="p-2 break-words font-medium">{info.titre}</td>
                <td className="p-2 break-words text-sm text-gray-600">
                  {info.contenus[0]?.type === 'TEXTE'
                    ? info.contenus[0].valeur.slice(0, 100)
                    : info.contenus[0]?.valeur}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(info)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
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
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl space-y-4">
            <h3 className="text-xl font-semibold">
              {editId ? 'Modifier une information' : 'Nouvelle information'}
            </h3>

            <input
              type="text"
              placeholder="Titre"
              value={form.titre}
              onChange={(e) => setForm({ ...form, titre: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ContenuInformation['type'], valeur: '', file: null })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="TEXTE">Texte</option>
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Vidéo</option>
              <option value="DOCUMENT">Document</option>
            </select>

            {form.type === 'TEXTE' ? (
              <textarea
                placeholder="Contenu"
                value={form.valeur}
                onChange={(e) => setForm({ ...form, valeur: e.target.value })}
                className="border rounded px-3 py-2 w-full h-40"
              />
            ) : (
              <input
                type="file"
                accept={form.type === 'IMAGE' ? 'image/*' : form.type === 'VIDEO' ? 'video/*' : '*'}
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                className="border rounded px-3 py-2 w-full"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
