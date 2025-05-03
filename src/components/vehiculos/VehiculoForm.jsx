import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { createVehiculo, updateVehiculo } from '../../api/vehiculosService';
import { getProveedores } from '../../api/proveedoresService';
import { toast } from 'react-toastify';
import { InputField, SelectField } from '../forms/FormFields';
import AppButton from '../ui/AppButton';

const VehiculoForm = ({ vehiculo, onClose }) => {
  const [proveedores, setProveedores] = useState([]);

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
        </div>
      <div className="flex justify-end pt-4">
        <AppButton type="submit" variant="primary">
          Guardar
        </AppButton>
      </div>
    </form>
  );
};

export default VehiculoForm;
