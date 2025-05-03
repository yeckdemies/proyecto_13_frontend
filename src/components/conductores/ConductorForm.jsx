import { useForm } from 'react-hook-form';
import { createConductor, updateConductor } from '../../api/conductoresService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { InputField, SelectField } from '../forms/FormFields';

const ConductorForm = ({ conductor, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (conductor) {
      reset(conductor || {});
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
        <InputField label="DNI" name="dni" register={register} required errors={errors} />
        <InputField label="Nombre" name="nombre" register={register} required errors={errors} />
        <InputField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" register={register} />
        <InputField label="Teléfono" name="telefono" type="number" register={register} />
        <InputField label="Email" name="email" type="email" register={register} required errors={errors} />
        <InputField label="Direccion" name="direccion" register={register} required errors={errors} />
        <InputField label="Ciudad" name="ciudad" register={register} required errors={errors} />
        <InputField label="Provincia" name="provincia" register={register} required errors={errors} />
        <InputField label="Código Postal" name="codigoPostal" type="number" register={register} />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition">
        Guardar
        </button>
      </div>
    </form>
  );
};

export default ConductorForm;
