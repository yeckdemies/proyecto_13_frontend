import { useEffect, useState } from 'react';
import GenericTable from '../components/tables/GenericTable';
import { vehiculosColumns } from '../components/VehiculosTableConfig';
import VehiculoFormDrawer from '../components/vehiculos/VehiculoFormDrawer';
import { getVehiculos } from '../api/vehiculosService';
import DotsLoader from '../components/DotsLoader';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getVehiculos();
      if (res.success) {
        setVehiculos(res.data);
      } else {
        console.error(res.message);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <DotsLoader />
        </div>
      ) : (
        <GenericTable
          columns={vehiculosColumns}
          data={vehiculos}
          title=""
          onRowClick={(row) => {
            setVehiculoSeleccionado(row.original);
            setShowForm(true);
          }}
        />
      )}

      <VehiculoFormDrawer
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        vehiculo={vehiculoSeleccionado}
      />
    </div>
  );
};

export default Vehiculos;
