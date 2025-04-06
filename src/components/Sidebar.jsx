import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  UserGroupIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'




const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { to: '/vehiculos', label: 'Vehículos', icon: <TruckIcon className="w-6 h-6" /> },
    { to: '/conductores', label: 'Conductores', icon: <UserGroupIcon className="w-6 h-6" /> },
    { to: '/metodos-pago', label: 'Métodos de pago', icon: <CreditCardIcon className="w-6 h-6" /> },
    { to: '/sanciones', label: 'Sanciones', icon: <ExclamationTriangleIcon className="w-6 h-6" /> },
    { to: '/mantenimientos', label: 'Mantenimientos', icon: <WrenchScrewdriverIcon className="w-6 h-6" /> },
    { to: '/proveedores', label: 'Proveedores', icon: <BuildingStorefrontIcon className="w-6 h-6" /> },
  ];

  return (
    <div
      ref={sidebarRef}
      className={`h-screen bg-white shadow-md transition-all duration-300 ease-in-out 
      ${open ? 'w-64' : 'w-16'} flex flex-col`}
    >
      {/* Header con botón */}
      <div className="relative h-16 flex items-center shadow-sm">
        <button
          onClick={() => setOpen(!open)}
          className={`absolute ${open ? 'right-4' : 'left-1/2 -translate-x-1/2'} 
          text-gray-700 focus:outline-none`}
        >
          {open ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 p-2">
        {menuItems.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-4 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition 
              ${location.pathname === to ? 'bg-blue-50 text-blue-600' : ''}
            `}
          >
            {icon}
            {open && <span className="text-sm font-medium">{label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
