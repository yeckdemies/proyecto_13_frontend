import { useForm } from 'react-hook-form';
import { createConductor, updateConductor } from '../../api/conductoresService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { InputField } from '../forms/FormFields';
import AppButton from '../ui/AppButton';

const ConductorForm = ({ conductor, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (conductor) {
      reset(conductor);
    }
  }, [conductor, reset]);

  const onSubmit = async (data) => {
    const res = conductor
      ? await updateConductor(conductor._id, data)
      : await createConductor(data);

    if (res.success) {
      toast.success('Conductor guardado correctamente');
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar el conductor');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      <div className="flex flex-col gap-4">
        <InputField
          label="DNI"
          name="dni"
          register={register}
          rules={{
            required: 'El DNI es obligatorio',
            pattern: {
              value: /^[0-9]{8}[A-Z]$/,
              message: 'Formato de DNI inválido (8 números + 1 letra mayúscula)'
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
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          register={register}
          rules={{
            required: 'La fecha de nacimiento es obligatoria',
            validate: (value) => {
              const fecha = new Date(value);
              const hoy = new Date();
              const minimo = new Date('1900-01-01');
              if (fecha > hoy) return 'Su fecha de nacimiento no puede ser futura';
              if (fecha < minimo) return 'La fecha de nacimiento no puede ser anterior a 1900';
              return true;
            }
          }}
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
              value: /^[67][0-9]{8}$/,
              message: 'Debe contener 9 dígitos y empezar por 6 o 7'
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
              message: 'Debe contener 5 dígitos'
            }
          }}
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

export default ConductorForm;
