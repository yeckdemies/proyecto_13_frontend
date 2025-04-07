// VehiculoForm.jsx
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { createVehiculo, updateVehiculo } from '../../api/vehiculosService';
import { getProveedores } from '../../api/proveedoresService';
import { getConductores } from '../../api/conductoresService';
import { toast } from 'react-toastify';

const tabs = ['General', 'Contrato / Conductor', 'Permiso / Ubicación'];

const VehiculoForm = ({ vehiculo, onClose }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [proveedores, setProveedores] = useState([]);
  const [conductores, setConductores] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (vehiculo) reset(vehiculo);
    (async () => {
      const provRes = await getProveedores();
      if (provRes.success) setProveedores(provRes.data);

      const condRes = await getConductores();
      if (condRes.success) setConductores(condRes.data);
    })();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm focus:outline-none transition-all duration-200 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'General' && (
        <div className="flex flex-col gap-4">
          <InputField label="Matrícula" name="matricula" register={register} required errors={errors} />
          <InputField label="Marca" name="marca" register={register} />
          <InputField label="Modelo" name="modelo" register={register} />
          <InputField label="Año" name="año" type="number" register={register} />
          <InputField label="Color" name="color" register={register} />
          <InputField label="Bastidor" name="bastidor" register={register} />

          <SelectField label="Tipo de Vehículo" name="tipoVehiculo" options={['turismo', 'suv', 'furgoneta']} register={register} required errors={errors} />
          <SelectField label="Tipo de Combustible" name="tipoCombustible" options={['diesel', 'gasolina', 'diesel + adv', 'eléctrico', 'gas']} register={register} required errors={errors} />
          <SelectField label="Propiedad" name="propiedad" options={['renting', 'propio']} register={register} required errors={errors} />
          <SelectField label="Estado" name="estado" options={['activo', 'inactivo', 'taller']} register={register} />
          <SelectField label="País" name="pais" options={['España', 'Alemania', 'Italia', 'Francia', 'Marruecos', 'Mexico', 'EEUU']} register={register} required errors={errors} />
          <InputField label="Ciudad" name="ciudad" register={register} />
        </div>
      )}

      {activeTab === 'Contrato / Conductor' && (
        <div className="flex flex-col gap-4">
          <InputField label="Coste mensual alquiler" name="costeAlquilerMensual" type="number" register={register} />
          <InputField label="Inicio contrato renting" name="fechaInicioContratoRenting" type="date" register={register} />
          <InputField label="Fin contrato renting" name="fechaFinContratoRenting" type="date" register={register} />
          <InputField label="Empresa titular" name="empresaTitular" register={register} />
          <SelectField label="Tipo Renting" name="tipoRenting" options={['fijo', 'variable']} register={register} />

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("telemetria")} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label className="text-gray-700">¿Tiene telemetría?</label>
          </div>

          <SelectField label="Proveedor" name="proveedor" options={proveedores.map(p => ({ value: p._id, label: p.nombre }))} register={register} />
          <SelectField label="Conductor" name="conductor" options={conductores.map(c => ({ value: c._id, label: c.nombre }))} register={register} />
        </div>
      )}

      {activeTab === 'Permiso / Ubicación' && (
        <div className="flex flex-col gap-4">
          {!vehiculo && (
            <InputField label="Permiso de circulación" name="permisoCirculacion" type="file" register={register} required errors={errors} />
          )}
          <InputField label="Latitud" name="lat" type="number" register={register} />
          <InputField label="Longitud" name="lng" type="number" register={register} />
          <InputField label="Fecha ITV" name="fechaVigorItv" type="date" register={register} />
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition">
          Guardar
        </button>
      </div>
    </form>
  );
};

const InputField = ({ label, name, register, required = false, type = 'text', errors }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</label>
    <input
      type={type}
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
    />
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

const SelectField = ({ label, name, options, register, required = false, errors }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500"> *</span>}</label>
    <select
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-blue-500"
    >
      <option value="">Seleccionar</option>
      {options.map((opt) => (
        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

export default VehiculoForm;