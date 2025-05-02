import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  createReserva,
  updateReserva,
  comprobarDisponibilidad
} from '../../api/reservasService';
import { getVehiculos } from '../../api/vehiculosService';
import { getConductores } from '../../api/conductoresService';
import { toast } from 'react-toastify';

const ReservaForm = ({ reserva, onClose }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState({
    vehiculoDisponible: true,
    conductorDisponible: true
  });
  const [isComprobandoDisponibilidad, setIsComprobandoDisponibilidad] = useState(false);
  const [vehiculoOriginal, setVehiculoOriginal] = useState(null);
  const [conductorOriginal, setConductorOriginal] = useState(null);

  const esCancelada = reserva?.estado === 'Cancelada';

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const vehiculo = watch('vehiculo');
  const conductor = watch('conductor');
  const fechaInicio = watch('fechaInicio');
  const fechaFin = watch('fechaFin');

  const reservaId = useMemo(() => reserva?._id, [reserva]);

  useEffect(() => {
    (async () => {
      const vehRes = await getVehiculos();
      if (vehRes.success) setVehiculos(vehRes.data);

      const condRes = await getConductores();
      if (condRes.success) setConductores(condRes.data);

      if (reserva) {
        reset({
          ...reserva,
          vehiculo: reserva.vehiculo?._id ?? reserva.vehiculo,
          conductor: reserva.conductor?._id ?? reserva.conductor,
          fechaInicio: reserva.fechaInicio?.substring(0, 10),
          fechaFin: reserva.fechaFin?.substring(0, 10),
          motivoCancelacion: reserva.motivoCancelacion || ''
        });

        setVehiculoOriginal(reserva.vehiculo?._id ?? reserva.vehiculo);
        setConductorOriginal(reserva.conductor?._id ?? reserva.conductor);
      } else {
        reset({});
      }
    })();
  }, [reserva, reset]);

  useEffect(() => {
    const comprobar = async () => {
      if (!vehiculo || !conductor || !fechaInicio || !fechaFin) return;

      setIsComprobandoDisponibilidad(true);
      try {
        const res = await comprobarDisponibilidad({
          id: reservaId,
          vehiculo,
          conductor,
          fechaInicio,
          fechaFin
        });

        if (res.success) {
          setDisponibilidad(res.data);
        } else {
          toast.error(res.message || 'Error comprobando disponibilidad');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error inesperado al comprobar disponibilidad');
      } finally {
        setIsComprobandoDisponibilidad(false);
      }
    };

    comprobar();
  }, [vehiculo, conductor, fechaInicio, fechaFin, reservaId]);

  const onSubmit = async (data) => {
    const mismoVehiculo = vehiculo === vehiculoOriginal;
    const mismoConductor = conductor === conductorOriginal;

    if (
      !esCancelada &&
      ((!disponibilidad.vehiculoDisponible && !mismoVehiculo) ||
        (!disponibilidad.conductorDisponible && !mismoConductor))
    ) {
      toast.error('Vehículo o conductor no disponibles');
      return;
    }

    const res = reserva
      ? await updateReserva(reserva._id, data)
      : await createReserva(data);

    if (res.success) {
      toast.success('Reserva guardada correctamente');
      onClose();
    } else {
      toast.error(res.message || 'Error al guardar la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 text-sm">
      {esCancelada && (
        <div className="text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded text-sm">
          Esta reserva está cancelada. Solo puedes modificar el motivo de la cancelación.
        </div>
      )}

      <div className="flex flex-col gap-4">
        <SelectField
          label="Vehículo"
          name="vehiculo"
          options={vehiculos.map(v => ({ value: v._id, label: v.matricula }))}
          register={register}
          required
          errors={errors}
          disabled={esCancelada}
        />
        {!isComprobandoDisponibilidad &&
          !disponibilidad.vehiculoDisponible &&
          vehiculo !== vehiculoOriginal &&
          !esCancelada && (
            <p className="text-red-500 text-xs">El vehículo no está disponible</p>
          )}

        <SelectField
          label="Conductor"
          name="conductor"
          options={conductores.map(c => ({ value: c._id, label: c.nombre }))}
          register={register}
          required
          errors={errors}
          disabled={esCancelada}
        />
        {!isComprobandoDisponibilidad &&
          !disponibilidad.conductorDisponible &&
          conductor !== conductorOriginal &&
          !esCancelada && (
            <p className="text-red-500 text-xs">El conductor no está disponible</p>
          )}

        <InputField
          label="Fecha de inicio"
          name="fechaInicio"
          type="date"
          register={register}
          required
          errors={errors}
          disabled={esCancelada}
        />

        <InputField
          label="Fecha de fin"
          name="fechaFin"
          type="date"
          register={register}
          required
          errors={errors}
          disabled={esCancelada}
        />

        {esCancelada && (
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-700">
              Motivo de cancelación
            </label>
            <textarea
              {...register('motivoCancelacion')}
              className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Describe el motivo si deseas modificarlo..."
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

const InputField = ({ label, name, register, required = false, type = 'text', errors, disabled = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500"> *</span>}
    </label>
    <input
      type={type}
      disabled={disabled}
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      className="mt-1 block w-full rounded-md border px-3 py-2 border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
    />
    {errors?.[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
  </div>
);

const SelectField = ({ label, name, options, register, required = false, errors, disabled = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500"> *</span>}
    </label>
    <select
      disabled={disabled}
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
    >
      <option value="">Seleccionar</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {errors?.[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
  </div>
);

export default ReservaForm;
