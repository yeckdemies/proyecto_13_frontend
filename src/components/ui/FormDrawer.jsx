import { useRef, useEffect } from 'react';

const FormDrawer = ({ isOpen, onClose, title, children }) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={drawerRef}
      className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center px-4 py-5 border-b border-gray-200 bg-gray-50 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-800 text-xl">×</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {children}
      </div>
    </div>
  );
};

export default FormDrawer;