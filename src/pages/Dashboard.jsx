import { useEffect, useState } from 'react';
import { getVehiculos } from '../api/vehiculosService';
import { getConductores } from '../api/conductoresService';
import { getReservas } from '../api/reservasService';
import { getProveedores } from '../api/proveedoresService';
import { getAllUsers } from '../api/userService';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TruckIcon,
  UserGroupIcon,
  WalletIcon,
  UserIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    vehiculos: 0,
    conductores: 0,
    reservas: 0,
    proveedores: 0,
    usuarios: 0,
  });

  const cargarDatos = async () => {
    try {
      const [resVeh, resCond, resRes, resProv, resUsers] = await Promise.all([
        getVehiculos(),
        getConductores(),
        getReservas(),
        getProveedores(),
        getAllUsers(),
      ]);

      setStats({
        vehiculos: resVeh.success ? resVeh.data.length : 0,
        conductores: resCond.success ? resCond.data.length : 0,
        reservas: resRes.success ? resRes.data.length : 0,
        proveedores: resProv.success ? resProv.data.length : 0,
        usuarios: resUsers.success ? resUsers.data.length : 0,
      });
    } catch (error) {
      console.error(error);
      toast.error(`Error al cargar datos del dashboard: ${error.message}`);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cards = [
    { label: 'Vehículos', value: stats.vehiculos, icon: <TruckIcon className="w-8 h-8 text-blue-600" /> },
    { label: 'Conductores', value: stats.conductores, icon: <UserIcon className="w-8 h-8 text-green-600" /> },
    { label: 'Reservas activas', value: stats.reservas, icon: <CalendarDateRangeIcon className="w-8 h-8 text-purple-600" /> },
    { label: 'Proveedores', value: stats.proveedores, icon: <WalletIcon className="w-8 h-8 text-yellow-600" /> },
    { label: 'Usuarios', value: stats.usuarios, icon: <UserGroupIcon className="w-8 h-8 text-pink-600" /> },
  ];

  const chartData = [
    { name: 'Vehículos', value: stats.vehiculos },
    { name: 'Conductores', value: stats.conductores },
    { name: 'Reservas', value: stats.reservas },
    { name: 'Proveedores', value: stats.proveedores },
    { name: 'Usuarios', value: stats.usuarios },
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h1>

      {/* Tarjetas métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <div className="text-3xl">{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-xl font-semibold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de barras */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen General</h2>

        <div className="w-full min-h-[300px] sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 14 }}
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;