import { useForm } from 'react-hook-form';
import { loginUser } from '../api/userService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async ({ userName, password }) => {
    setErrorMsg('');
    const res = await loginUser(userName, password);

    if (res.success) {
      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('user', JSON.stringify(res.user));

      if (res.user.mustChangePassword) {
        navigate('/CambiarPassword');
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              {...register('userName', { required: 'Campo obligatorio' })}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              {...register('password', { required: 'Campo obligatorio' })}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
