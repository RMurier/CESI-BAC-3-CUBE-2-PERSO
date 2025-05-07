import { useUser, SignOutButton, useClerk } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function AppBar() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const checkIsAdmin = async () => {
    if (!user) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/utilisateurs/${user.id}/admin`)
      if (res.ok) {
        const data = await res.json()
        setIsAdmin(data.isAdmin)
      } else {
        setIsAdmin(false)
      }
    } catch (err) {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setIsAdmin(null)
      return
    }
    if (isLoaded) {
      checkIsAdmin()
    }
  }, [isLoaded, user])

  useEffect(() => {
    if (isAdmin === false) {
      ;(async () => {
        alert("Vous n'êtes pas un administrateur.")
        await signOut()
        navigate('/login')
      })()
    }
  }, [isAdmin, signOut, navigate])

  if (!isLoaded || (user && isAdmin === null)) {
    return (
      <div className="p-4 text-gray-500 text-sm text-center">
        Chargement...
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1
          className="text-xl font-semibold text-gray-800 cursor-pointer"
          onClick={() => navigate('/')}
        >
          CESIZEN
        </h1>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex gap-4 p-4 md:p-0 shadow md:shadow-none ${menuOpen ? 'block' : 'hidden'} md:flex`}>
          {user && isAdmin && (
            <>
              <Link to="/users" className="block py-1 text-gray-700 hover:text-blue-600 font-medium">
                Utilisateurs
              </Link>
              <Link to="/emotions" className="block py-1 text-gray-700 hover:text-blue-600 font-medium">
                Émotions
              </Link>
              <Link to="/respiration" className="block py-1 text-gray-700 hover:text-blue-600 font-medium">
                Exercices de respiration
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden md:inline text-sm text-gray-600">{user.username}</span>
            <SignOutButton>
              <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                Déconnexion
              </button>
            </SignOutButton>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Se connecter
          </Link>
        )}
      </div>
    </nav>
  )
}
