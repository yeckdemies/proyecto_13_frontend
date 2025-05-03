import { useForm } from 'react-hook-form';
import { createProveedor, updateProveedor } from '../../api/proveedoresService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { InputField, SelectField } from '../forms/FormFields';

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
        <InputField label="NIF" name="nif" register={register} required errors={errors} />
        <InputField label="Nombre" name="nombre" register={register} required errors={errors} />
        <InputField label="Razón Social" name="razonSocial" register={register} required errors={errors} />
        <InputField label="Teléfono" name="telefono" type="number" register={register} />
        <InputField label="Email" name="email" type="email" register={register} required errors={errors} />
        <InputField label="Página Web" name="paginaWeb" register={register} required errors={errors} />
        <InputField label="Direccion" name="direccion" register={register} required errors={errors} />
        <InputField label="Ciudad" name="ciudad" register={register} required errors={errors} />
        <InputField label="Provincia" name="provincia" register={register} required errors={errors} />
        <InputField label="Código Postal" name="codigoPostal" type="number" register={register} />
        <SelectField label="Tipo de Proveedor" name="tipo" options={['Renting', 'Tarjeta Combustible', 'Taller']} register={register} required errors={errors} />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition">
        Guardar
        </button>
      </div>
    </form>
  );
};

export default ProveedorForm;
