import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/userService';
import { toast } from 'react-toastify';

const CambiarPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const res = await changePassword({ newPassword: data.newPassword });

    if (res.success) {
      toast.success('Contraseña actualizada. Vuelve a iniciar sesión');
      sessionStorage.clear();
      navigate('/login');
    } else {
      toast.error(res.message || 'Error al cambiar la contraseña');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <input
              type="password"
              {...register('newPassword', { required: 'Campo obligatorio' })}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Campo obligatorio' })}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarPassword;
