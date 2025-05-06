// GlobalLoader.jsx
import { useEffect, useState } from 'react';
import DotsLoader from './DotsLoader';

let loaderCount = 0;

const GlobalLoader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      loaderCount++;
      setVisible(true);
    };

    const hide = () => {
      loaderCount = Math.max(0, loaderCount - 1);
      if (loaderCount === 0) setVisible(false);
    };

    document.addEventListener('loader:show', show);
    document.addEventListener('loader:hide', hide);

    return () => {
      document.removeEventListener('loader:show', show);
      document.removeEventListener('loader:hide', hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent pointer-events-auto">
      <DotsLoader />
    </div>
  );
};

export default GlobalLoader;