// src/pages/Vehiculos.jsx
import { useState } from 'react';
import GenericTable from '../components/tables/GenericTable';
import { vehiculosColumns } from '../components/VehiculosTableConfig';
import VehiculoFormDrawer from '../components/vehiculos/VehiculoFormDrawer';

const Vehiculos = () => {
  const [showForm, setShowForm] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const handleNuevoVehiculo = () => {
    setVehiculoSeleccionado(null);
    setShowForm(true);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vehículos</h1>
        <button
          onClick={handleNuevoVehiculo}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Añadir Vehículo
        </button>
      </div>

      <GenericTable
        columns={vehiculosColumns}
        dataUrl="http://localhost:10000/api/v1/vehiculos"
        title=""
        onRowClick={(row) => {
          setVehiculoSeleccionado(row.original);
          setShowForm(true);
        }}
      />

      <VehiculoFormDrawer
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        vehiculo={vehiculoSeleccionado}
      />
    </div>
  );
};

export default Vehiculos;
