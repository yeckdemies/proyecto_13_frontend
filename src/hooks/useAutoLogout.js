import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = (delay = 30 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      sessionStorage.clear();
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    };

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(logout, delay);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate, delay]);
};

export default useAutoLogout;