import { useForm } from 'react-hook-form';
import { createUser, updateUser } from '../../api/userService';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { InputField, SelectField } from '../forms/FormFields';
import AppButton from '../ui/AppButton';

const UserForm = ({ user, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    reset(user || {});
  }, [user, reset]);

  const onSubmit = async (data) => {
    const res = user
      ? await updateUser(user._id, data)
      : await createUser(data);

    if (res.success) {
      toast.success('Usuario guardado correctamente');
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      <div className="flex flex-col gap-4">
        <InputField label="Usuario" name="userName" register={register} required errors={errors} />
        <InputField label="Email" name="email" register={register} required errors={errors} />
        <SelectField label="Rol" name="role" options={['user', 'admin']} register={register} required errors={errors} />
      </div>
      <div className="flex justify-end pt-4">
        <AppButton type="submit" variant="primary">
          Guardar
        </AppButton>
      </div>
    </form>
  );
};

export default UserForm;