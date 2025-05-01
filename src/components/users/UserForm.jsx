import { useForm } from 'react-hook-form';
import { createUser, updateUser } from '../../api/userService';
import { toast } from 'react-toastify';

const UserForm = ({ user, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    console.log('formData', formData);
    const res = user
      ? await updateUser(user._id, formData)
      : await createUser(formData);

    if (res.success) {
      toast.success('User guardado correctamente');
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar el userio');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      <div className="flex flex-col gap-4">
        <InputField label="Usuario" name="user" register={register} required errors={errors} />
        <InputField label="Email" name="email" register={register} required errors={errors} />
        <InputField label="Rol" name="role" type="date" register={register} />
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

export default UserForm;
