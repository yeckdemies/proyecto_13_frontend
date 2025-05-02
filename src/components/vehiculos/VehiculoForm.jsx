import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { createVehiculo, updateVehiculo } from '../../api/vehiculosService';
import { getProveedores } from '../../api/proveedoresService';
import { getConductores } from '../../api/conductoresService';
import { toast } from 'react-toastify';

const VehiculoForm = ({ vehiculo, onClose }) => {
  const [proveedores, setProveedores] = useState([]);
  const [conductores, setConductores] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    (async () => {
      const provRes = await getProveedores();
      if (provRes.success) setProveedores(provRes.data);

      const condRes = await getConductores();
      if (condRes.success) setConductores(condRes.data);

      if (vehiculo) {
        reset(vehiculo);
      } else {
        reset({});
      }
    })();
  }, [vehiculo, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key === 'permisoCirculacion') {
        if (data[key]?.[0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
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
      <div className="flex flex-col gap-4">
        <SelectField label="Tipo de Vehículo" name="tipoVehiculo" options={['Turismo', 'SUV', 'Furgoneta']} register={register} required errors={errors} />
        <InputField label="Matrícula" name="matricula" register={register} required errors={errors} />
        <InputField label="Bastidor" name="bastidor" register={register} required errors={errors} />
        <SelectField label="Estado" name="estado" options={['Activo', 'Inactivo', 'Taller']} register={register} required errors={errors} />
        <SelectField label="Tipo de Combustible" name="tipoCombustible" options={['Diesel', 'Gasolina', 'Diesel + ADV', 'Eléctrico', 'Gas']} register={register} required errors={errors} />
      {!vehiculo && (
        <InputField label="Permiso de circulación" name="permisoCirculacion" type="file" register={register} required errors={errors} />
      )}
        <InputField label="Ciudad" name="ciudad" register={register} required errors={errors} />
        <InputField label="Marca" name="marca" register={register} required errors={errors} />
        <InputField label="Modelo" name="modelo" register={register} required errors={errors} />
        <InputField label="Año" name="anio" type="number" register={register} required errors={errors} />
        <InputField label="Color" name="color" register={register} />
        <InputField label="Fecha ITV" name="fechaVigorItv" type="date" register={register} required errors={errors} />
        <InputField label="Coste mensual alquiler" name="costeAlquilerMensual" type="number" register={register} />
        <InputField label="Inicio contrato renting" name="fechaInicioContratoRenting" type="date" register={register} />
        <InputField label="Fin contrato renting" name="fechaFinContratoRenting" type="date" register={register} />
        <SelectField label="Proveedor" name="proveedor" options={proveedores.map(p => ({ value: p._id, label: p.nombre }))} register={register} required errors={errors} />
        <SelectField label="Conductor" name="conductor" options={conductores.map(c => ({ value: c._id, label: c.nombre }))} register={register} required errors={errors} />
        </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition">
        Guardar
        </button>
      </div>
    </form>
  );
};

const InputField = ({ label, name, register, required = false, type = 'text', errors }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <input
      type={type}
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      className={`mt-1 block w-full rounded-md border ${
        type === 'file' ? 'p-1' : 'px-3 py-2'
      } border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500`}
    />
    {errors?.[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
  </div>
);

const SelectField = ({ label, name, options, register, required = false, errors }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
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
    {errors?.[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
  </div>
);

export default VehiculoForm;
