const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  full: 'w-full bg-blue-600 hover:bg-blue-700 text-white',
};

const AppButton = ({
  children,
  type = 'button',
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default AppButton;