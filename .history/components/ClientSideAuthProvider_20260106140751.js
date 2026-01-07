import dynamic from 'next/dynamic';

// Dynamically import AuthProvider with SSR disabled to prevent Firebase auth issues during server-side rendering
const AuthProvider = dynamic(() => import('../utils/context/authContext').then(mod => mod.AuthProvider), {
  ssr: false,
  loading: () => <div>Loading...</div> // Optional loading component
});

export default AuthProvider;