import { createBrowserRouter } from 'react-router-dom';
import { TabelaAgentes } from '../components/TabelaAgentes';
import { Login } from '../pages/Login';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TabelaAgentes />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <TabelaAgentes isAdmin={true} />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <h2>Página não encontrada</h2>
      </div>
    ),
  },
]); 