import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { createVehiculo, updateVehiculo } from '../../api/vehiculosService';
import { toast } from 'react-toastify';

const tabs = ['General', 'Permiso / Ubicación'];

const VehiculoForm = ({ vehiculo, onClose }) => {
  const [activeTab, setActiveTab] = useState('General');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (vehiculo) {
      reset(vehiculo);
    }
  }, [vehiculo, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const res = vehiculo
      ? await updateVehiculo(vehiculo._id, formData)
      : await createVehiculo(formData);

    if (res.success) {
      toast.success('Vehículo guardado correctamente');
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar vehículo');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex gap-2 bg-gray-100 p-2 rounded-md shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded transition 
              ${activeTab === tab
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-200'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB GENERAL */}
      {activeTab === 'General' && (
        <div className="flex flex-col gap-4">
          <InputField label="Matrícula" name="matricula" register={register} required errors={errors} />
          <InputField label="Marca" name="marca" register={register} />
          <InputField label="Modelo" name="modelo" register={register} />
          <InputField label="Año" name="año" type="number" register={register} />
          <InputField label="Color" name="color" register={register} />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Tipo de Vehículo</label>
            <select
              {...register("tipoVehiculo")}
              className="mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar</option>
              <option value="turismo">Turismo</option>
              <option value="suv">SUV</option>
              <option value="furgoneta">Furgoneta</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB PERMISO / UBICACIÓN */}
      {activeTab === 'Permiso / Ubicación' && (
        <div className="flex flex-col gap-4">
          <InputField label="Permiso de circulación" name="permisoCirculacion" type="file" register={register} />
          <InputField label="Latitud" name="lat" register={register} />
          <InputField label="Longitud" name="lng" register={register} />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

const InputField = ({ label, name, register, required = false, type = 'text', errors }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      className="mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

export default VehiculoForm;
