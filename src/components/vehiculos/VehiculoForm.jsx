import { useState, useEffect } from 'react';
import axios from 'axios';

const tabs = ['General', 'Permiso / Ubicación'];

const VehiculoForm = ({ vehiculo, onClose }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [formData, setFormData] = useState({
    tipoVehiculo: '',
    matricula: '',
    bastidor: '',
    propiedad: '',
    estado: 'activo',
    tipoCombustible: '',
    permisoCirculacion: null,
    ciudad: '',
    pais: '',
    marca: '',
    modelo: '',
    año: '',
    color: '',
    // ... luego más campos
  });

  // Si estamos en modo edición
  useEffect(() => {
    if (vehiculo) {
      setFormData({ ...vehiculo });
    }
  }, [vehiculo]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      if (vehiculo) {
        await axios.put(`http://localhost:10000/api/v1/vehiculos/${vehiculo._id}`, data);
      } else {
        await axios.post('http://localhost:10000/api/v1/vehiculos', data);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2 bg-white shadow-sm p-2 rounded-t-lg mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded ${
              activeTab === tab
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'General' && (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Matrícula</label>
            <input
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Marca</label>
            <input
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Modelo</label>
            <input
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Año</label>
            <input
              type="number"
              name="año"
              value={formData.año}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Color</label>
            <input
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Tipo de vehículo</label>
            <select
              name="tipoVehiculo"
              value={formData.tipoVehiculo}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Seleccionar</option>
              <option value="turismo">Turismo</option>
              <option value="suv">SUV</option>
              <option value="furgoneta">Furgoneta</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'Permiso / Ubicación' && (
        <div className="grid gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Permiso de circulación</label>
            <input
              type="file"
              name="permisoCirculacion"
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Latitud</label>
            <input
              name="lat"
              value={formData.lat || ''}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Longitud</label>
            <input
              name="lng"
              value={formData.lng || ''}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default VehiculoForm;
