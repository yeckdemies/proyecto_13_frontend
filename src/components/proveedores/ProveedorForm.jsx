import { useForm } from 'react-hook-form';
import { createProveedor, updateProveedor } from '../../api/proveedoresService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { InputField, SelectField } from '../forms/FormFields';
import AppButton from '../ui/AppButton';

const ProveedorForm = ({ proveedor, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (proveedor) {
      reset(proveedor || {});
    }
  }, [proveedor, reset]);

  const onSubmit = async (data) => {
    const res = proveedor
      ? await updateProveedor(proveedor._id, data)
      : await createProveedor(data);

    if (res.success) {
      toast.success('Proveedor guardado correctamente');
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar el proveedor');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      <div className="flex flex-col gap-4">
        <InputField
          label="NIF"
          name="nif"
          register={register}
          rules={{
            required: 'El NIF es obligatorio',
            pattern: {
              value: /^[A-Z0-9]{1}[0-9]{7}[A-Z0-9]{1}$/,
              message: 'Formato de NIF/CIF incorrecto'
            }
          }}
          errors={errors}
        />

        <InputField
          label="Nombre"
          name="nombre"
          register={register}
          rules={{ required: 'El nombre es obligatorio' }}
          errors={errors}
        />

        <InputField
          label="Razón Social"
          name="razonSocial"
          register={register}
          rules={{ required: 'La razón social es obligatoria' }}
          errors={errors}
        />

        <InputField
          label="Teléfono"
          name="telefono"
          type="tel"
          register={register}
          rules={{
            required: 'El teléfono es obligatorio',
            pattern: {
              value: /^[6789][0-9]{8}$/,
              message: 'Debe tener 9 dígitos y empezar por 6, 7, 8 o 9'
            }
          }}
          errors={errors}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          rules={{
            required: 'El email es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Formato de email inválido'
            }
          }}
          errors={errors}
        />

        <InputField
          label="Página Web"
          name="paginaWeb"
          register={register}
          rules={{
            required: 'La página web es obligatoria',
            pattern: {
              value: /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/,
              message: 'Formato de URL inválido'
            }
          }}
          errors={errors}
        />

        <InputField
          label="Dirección"
          name="direccion"
          register={register}
          rules={{ required: 'La dirección es obligatoria' }}
          errors={errors}
        />

        <InputField
          label="Ciudad"
          name="ciudad"
          register={register}
          rules={{ required: 'La ciudad es obligatoria' }}
          errors={errors}
        />

        <InputField
          label="Provincia"
          name="provincia"
          register={register}
          rules={{ required: 'La provincia es obligatoria' }}
          errors={errors}
        />

        <InputField
          label="Código Postal"
          name="codigoPostal"
          type="text"
          register={register}
          rules={{
            required: 'El código postal es obligatorio',
            pattern: {
              value: /^\d{5}$/,
              message: 'Debe tener 5 dígitos'
            }
          }}
          errors={errors}
        />

        <SelectField
          label="Tipo de Proveedor"
          name="tipo"
          options={['Renting', 'Tarjeta Combustible', 'Taller']}
          register={register}
          rules={{ required: 'El tipo de proveedor es obligatorio' }}
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

export default ProveedorForm;