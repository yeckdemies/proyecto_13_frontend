import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserName(user?.userName || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <div className="text-base font-semibold text-gray-800">
          Hola, <span className="text-blue-600">{userName}</span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-gray-100 text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H4a1 1 0 01-1-1V5a1 1 0 011-1h6a3 3 0 013 3v1" />
        </svg>
        Cerrar sesión
      </button>
    </header>
  );
};

export default Header;