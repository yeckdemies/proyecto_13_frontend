import VehiculoForm from './VehiculoForm';

const VehiculoFormDrawer = ({ isOpen, onClose, vehiculo }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">×</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <VehiculoForm vehiculo={vehiculo} onClose={onClose} />
      </div>
    </div>
  );
};


export default VehiculoFormDrawer;