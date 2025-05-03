import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { toast } from 'react-toastify';

import { getVehiculos } from '../api/vehiculosService';
import { getConductores } from '../api/conductoresService';
import { getReservas } from '../api/reservasService';
import { getProveedores } from '../api/proveedoresService';
import { getAllUsers } from '../api/userService';

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
    resumenReservas: {
      activas: 0,
      canceladas: 0,
      finalizadas: 0,
    },
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

      const reservas = resRes.success ? resRes.data : [];

      const activas = reservas.filter((r) => r.estado === 'Activa').length;
      const canceladas = reservas.filter((r) => r.estado === 'Cancelada').length;
      const finalizadas = reservas.filter((r) => r.estado === 'Finalizada').length;

      setStats({
        vehiculos: resVeh.success ? resVeh.data.length : 0,
        conductores: resCond.success ? resCond.data.length : 0,
        reservas: activas,
        proveedores: resProv.success ? resProv.data.length : 0,
        usuarios: resUsers.success ? resUsers.data.length : 0,
        resumenReservas: { activas, canceladas, finalizadas },
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

  const donutData = [
    { name: 'Activas', value: stats.resumenReservas?.activas || 0 },
    { name: 'Canceladas', value: stats.resumenReservas?.canceladas || 0 },
    { name: 'Finalizadas', value: stats.resumenReservas?.finalizadas || 0 },
  ];

  const barColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];
  const donutColors = ['#3b82f6', '#f87171', '#10b981'];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h1>

      {/* Tarjetas métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md ring-1 ring-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen General</h2>
        <div className="w-full min-h-[300px] sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#3b82f6' }}
                formatter={(value) => [`${value}`, 'Total']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800}>
                {chartData.map((_, index) => (
                  <Cell key={`bar-cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut de estado de reservas */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow-md ring-1 ring-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalle de Reservas</h2>
        <div className="w-full flex justify-center items-center min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                label
              >
                {donutData.map((_, i) => (
                  <Cell key={`donut-cell-${i}`} fill={donutColors[i % donutColors.length]} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;