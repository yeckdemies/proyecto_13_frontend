import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  TruckIcon,
  UserGroupIcon,
  WalletIcon,
  UserIcon,
  CalendarDateRangeIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef();
  const sidebarRef = useRef();

  useEffect(() => {
    if (open) {
      timeoutRef.current = setTimeout(() => setShowText(true), 200);
    } else {
      clearTimeout(timeoutRef.current);
      setShowText(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open]);

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (sidebarRef.current && !sidebarRef.current.matches(':hover')) {
        setOpen(false);
      }
    }, 100);
  };

  const menuItems = [
    { to: '/', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { to: '/vehiculos', label: 'Vehículos', icon: <TruckIcon className="w-6 h-6" /> },
    { to: '/conductores', label: 'Conductores', icon: <UserGroupIcon className="w-6 h-6" /> },
    { to: '/reservas', label: 'Reservas', icon: <CalendarDateRangeIcon className="w-6 h-6" /> },
    { to: '/proveedores', label: 'Proveedores', icon: <WalletIcon className="w-6 h-6" /> },
    { to: '/usuarios', label: 'Usuarios', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <div
      ref={sidebarRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={handleMouseLeave}
      className={`h-screen bg-white shadow-md transition-all duration-300 ease-in-out
      ${open ? 'w-64' : 'w-16'} flex flex-col`}
    >
      {/* Logo */}
      <div className="relative h-24 flex items-center justify-center">
        <Link to="/" className="absolute top-5 left-0 right-0 flex justify-center transition-all duration-300"
          style={{
            transform: open ? 'translateY(40px)' : 'translateY(0px)'
          }}
        >
          <img
            src="https://res.cloudinary.com/dszffglcl/image/upload/v1746219984/nbyec04ugqxs7p6nei3z.png"
            alt="Gestión de Flota"
            className={`transition-all duration-300 cursor-pointer
              ${open ? 'w-40 sm:w-52 md:w-64' : 'w-10 sm:w-12 md:w-14'}
            `}
          />
        </Link>
      </div>

      {/* Menú */}
      <div className="flex-1 flex flex-col justify-center p-2">
        <nav className="flex flex-col gap-2">
          {menuItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`cursor-pointer flex items-center gap-4 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md transition 
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