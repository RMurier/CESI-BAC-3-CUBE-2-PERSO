import { useUser, useAuth, UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export default function AdminHeader() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = useAdminCheck(user, signOut, navigate);

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.logo}>CESIZen Admin</span>

        {isSignedIn && isAdmin && (
          <nav style={styles.nav}>
            <NavLink to="/admin/utilisateurs" style={getLinkStyle}>Utilisateurs</NavLink>
            <NavLink to="/admin/categories" style={getLinkStyle}>Catégories</NavLink>
            <NavLink to="/admin/ressources" style={getLinkStyle}>Ressources</NavLink>
            <NavLink to="/admin/diagnostics" style={getLinkStyle}>Diagnostics</NavLink>
          </nav>
        )}
      </div>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button style={styles.login}>Se connecter</button>
        </SignInButton>
      </SignedOut>
    </header>
  );
}

function useAdminCheck(user: any, signOut: any, navigate: any) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_ADDRESS}/api/utilisateurs/${user.id}/is-admin`);
        if (!res.ok) {
          setIsAdmin(false);
          await signOut();
          navigate('/');
          return;
        }

        const data = await res.json();
        const isAdminResp = data.isAdmin === true;
        setIsAdmin(isAdminResp);

        if (!isAdminResp) {
          await signOut();
          navigate('/');
        }
      } catch (err) {
        console.error('Erreur vérification admin :', err);
        setIsAdmin(false);
        await signOut();
        navigate('/');
      }
    };

    verify();
  }, [user]);

  return isAdmin;
}

const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: 'none',
  fontWeight: 500,
  color: isActive ? '#007AFF' : '#444',
  borderBottom: isActive ? '2px solid #007AFF' : '2px solid transparent',
  paddingBottom: 4,
});

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: '#007AFF',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  login: {
    backgroundColor: '#007AFF',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    fontWeight: '600',
    cursor: 'pointer',
  },
};
