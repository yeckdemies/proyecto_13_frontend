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
    })();
  }, []);

  useEffect(() => {
    if (!vehiculo || proveedores.length === 0) return;

    reset({
      tipoVehiculo: vehiculo.tipoVehiculo || '',
      matricula: vehiculo.matricula || '',
      bastidor: vehiculo.bastidor || '',
      estado: vehiculo.estado || 'Activo',
      tipoCombustible: vehiculo.tipoCombustible || '',
      ciudad: vehiculo.ciudad || '',
      marca: vehiculo.marca || '',
      modelo: vehiculo.modelo || '',
      anio: vehiculo.anio || '',
      color: vehiculo.color || '',
      fechaVigorItv: vehiculo.fechaVigorItv?.substring(0, 10) || '',
      costeAlquilerMensual: vehiculo.costeAlquilerMensual || '',
      fechaInicioContratoRenting: vehiculo.fechaInicioContratoRenting?.substring(0, 10) || '',
      fechaFinContratoRenting: vehiculo.fechaFinContratoRenting?.substring(0, 10) || '',
      proveedor: typeof vehiculo.proveedor === 'object'
        ? vehiculo.proveedor._id
        : vehiculo.proveedor || ''
    });
  }, [vehiculo, proveedores, reset]);
  

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
      reset();
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar vehículo');
    }
  };

  const validarFecha = (value) => {
    const fecha = new Date(value);
    const min = new Date('2000-01-01');
    const max = new Date('2050-12-31');
    if (fecha < min) return 'Fecha mínima: año 2000';
    if (fecha > max) return 'Fecha máxima: año 2050';
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      <div className="flex flex-col gap-4">
        <SelectField
          label="Tipo de Vehículo"
          name="tipoVehiculo"
          options={['Turismo', 'SUV', 'Furgoneta']}
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <InputField
          label="Matrícula"
          name="matricula"
          register={register}
          rules={{
            required: 'Campo requerido',
            pattern: {
              value: /^[0-9]{4}[B-DF-HJ-NP-TV-Z]{3}$/,
              message: 'Formato inválido (ej. 1234BCD)'
            }
          }}
          errors={errors}
        />

        <InputField
          label="Bastidor"
          name="bastidor"
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <SelectField
          label="Estado"
          name="estado"
          options={['Activo', 'Taller']}
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <SelectField
          label="Tipo de Combustible"
          name="tipoCombustible"
          options={['Diesel', 'Gasolina', 'Diesel + ADV', 'Eléctrico', 'Gas']}
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        {!vehiculo && (
          <InputField
            label="Permiso de circulación"
            name="permisoCirculacion"
            type="file"
            register={register}
            rules={{ required: 'Campo requerido' }}
            errors={errors}
          />
        )}

        <InputField
          label="Ciudad"
          name="ciudad"
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <InputField
          label="Marca"
          name="marca"
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <InputField
          label="Modelo"
          name="modelo"
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <InputField
          label="Año"
          name="anio"
          type="number"
          register={register}
          rules={{
            required: 'Campo requerido',
            min: { value: 2000, message: 'Mínimo año 2000' },
            max: { value: 2050, message: 'Máximo año 2050' }
          }}
          errors={errors}
        />

        <InputField
          label="Color"
          name="color"
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <InputField
          label="Fecha ITV"
          name="fechaVigorItv"
          type="date"
          register={register}
          rules={{
            required: 'Campo requerido',
            validate: validarFecha
          }}
          errors={errors}
        />

        <InputField
          label="Coste mensual alquiler"
          name="costeAlquilerMensual"
          type="number"
          register={register}
          rules={{ required: 'Campo requerido' }}
          errors={errors}
        />

        <InputField
          label="Inicio contrato renting"
          name="fechaInicioContratoRenting"
          type="date"
          register={register}
          rules={{
            required: 'Campo requerido',
            validate: validarFecha
          }}
          errors={errors}
        />

        <InputField
          label="Fin contrato renting"
          name="fechaFinContratoRenting"
          type="date"
          register={register}
          rules={{
            required: 'Campo requerido',
            validate: validarFecha
          }}
          errors={errors}
        />

        <SelectField
          label="Proveedor"
          name="proveedor"
          options={proveedores.map(p => ({ value: p._id, label: p.nombre }))}
          register={register}
          required
          errors={errors}
        />

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