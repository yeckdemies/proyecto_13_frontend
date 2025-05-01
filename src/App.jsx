import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Vehiculos from './pages/Vehiculos'
import Conductores from './pages/Conductores'
import Proveedores from './pages/Proveedores'
import Login from './pages/Login'
import Usuarios from './pages/Usuarios'
import ProtectedRoute from './components/ProtectedRoute';
import useAutoLogout from './hooks/useAutoLogout';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useAutoLogout();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="conductores" element={<Conductores />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App
