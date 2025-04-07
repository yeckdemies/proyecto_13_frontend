import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Vehiculos from './pages/Vehiculos'
import Conductores from './pages/Conductores'
import MetodosPago from './pages/MetodosPago'
import Sanciones from './pages/Sanciones'
import Mantenimientos from './pages/Mantenimientos'
import Proveedores from './pages/Proveedores'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
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
          <Route path="metodos-pago" element={<MetodosPago />} />
          <Route path="sanciones" element={<Sanciones />} />
          <Route path="mantenimientos" element={<Mantenimientos />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App
