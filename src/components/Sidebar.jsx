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
  const [showText, setShowText] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef();

  useEffect(() => {
    if (open) {
      timeoutRef.current = setTimeout(() => setShowText(true), 200);
    } else {
      clearTimeout(timeoutRef.current);
      setShowText(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open]);

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
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={`h-screen bg-white shadow-md transition-all duration-300 ease-in-out
      ${open ? 'w-64' : 'w-16'} flex flex-col`}
    >
      <div className="flex-1 flex flex-col justify-center p-2">
        <nav className="flex flex-col gap-2">
          {menuItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-4 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition 
                ${location.pathname === to ? 'bg-blue-50 text-blue-600' : ''}
              `}
            >
              {icon}
              {showText && <span className="text-sm font-medium">{label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
