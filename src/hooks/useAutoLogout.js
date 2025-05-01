import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = (delay = 30 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      navigate('/login');
    };

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, delay);
    };

    const events = ['mousemove', 'keydown', 'click'];

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, delay]);
};

export default useAutoLogout;
