import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  createReserva,
  updateReserva,
  comprobarDisponibilidad
} from '../../api/reservasService';
import { getVehiculos } from '../../api/vehiculosService';
import { getConductores } from '../../api/conductoresService';
import { toast } from 'react-toastify';
import { InputField, SelectField } from '../forms/FormFields';
import AppButton from '../ui/AppButton';

const ReservaForm = ({ reserva, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState({
    vehiculoDisponible: true,
    conductorDisponible: true
  });
  const [isComprobando, setIsComprobando] = useState(false);

  const reservaId = useMemo(() => reserva?._id, [reserva]);

  const vehiculoOriginal = useMemo(() => {
    if (reserva?.vehiculo && typeof reserva.vehiculo === 'object') {
      return reserva.vehiculo._id;
    }
    return reserva?.vehiculo || '';
  }, [reserva]);

  const conductorOriginal = useMemo(() => {
    if (reserva?.conductor && typeof reserva.conductor === 'object') {
      return reserva.conductor._id;
    }
    return reserva?.conductor || '';
  }, [reserva]);

  const esCancelada = reserva?.estado === 'Cancelada';

  const vehiculo = watch('vehiculo');
  const conductor = watch('conductor');
  const fechaInicio = watch('fechaInicio');
  const fechaFin = watch('fechaFin');

  useEffect(() => {
    const cargarDatos = async () => {
      const [vehRes, condRes] = await Promise.all([getVehiculos(), getConductores()]);
      if (vehRes.success) setVehiculos(vehRes.data);
      if (condRes.success) setConductores(condRes.data);

      if (reserva) {
        reset({
          vehiculo: vehiculoOriginal,
          conductor: conductorOriginal,
          fechaInicio: reserva.fechaInicio?.substring(0, 10),
          fechaFin: reserva.fechaFin?.substring(0, 10),
          motivoCancelacion: reserva.motivoCancelacion || ''
        });
      } else {
        reset({
          vehiculo: '',
          conductor: '',
          fechaInicio: '',
          fechaFin: '',
          motivoCancelacion: ''
        });
      }
    };

    cargarDatos();
  }, [reserva, reset, vehiculoOriginal, conductorOriginal]);

  const verificarDisponibilidad = useCallback(async () => {
    if (!vehiculo || !conductor || !fechaInicio || !fechaFin) return;

    const hoy = new Date().toISOString().split('T')[0];
    if (fechaInicio < hoy) {
      toast.error('La fecha de inicio no puede ser anterior a hoy');
      return;
    }

    if (fechaInicio >= fechaFin) {
      toast.error('La fecha de fin debe ser posterior a la de inicio');
      return;
    }

    setIsComprobando(true);
    try {
      const res = await comprobarDisponibilidad({
        id: reservaId,
        vehiculo,
        conductor,
        fechaInicio,
        fechaFin
      });

      const valores = res?.data ?? {
        vehiculoDisponible: true,
        conductorDisponible: true
      };

      setDisponibilidad(valores);

      if (!res.success) {
        toast.error(res.message || 'Error comprobando disponibilidad');
      }
    } catch (err) {
      setDisponibilidad({
        vehiculoDisponible: true,
        conductorDisponible: true
      });
      toast.error('Error inesperado al comprobar disponibilidad: ', err.message);
    } finally {
      setIsComprobando(false);
    }
  }, [vehiculo, conductor, fechaInicio, fechaFin, reservaId]);

  useEffect(() => {
    verificarDisponibilidad();
  }, [verificarDisponibilidad]);

  const onSubmit = async (data) => {
    const mismoVehiculo = vehiculo === vehiculoOriginal;
    const mismoConductor = conductor === conductorOriginal;

    const fechaIni = new Date(data.fechaInicio);
    const fechaFin = new Date(data.fechaFin);

    if (fechaIni >= fechaFin) {
      toast.error('La fecha de fin debe ser posterior a la de inicio');
      return;
    }

    if (
      !esCancelada &&
      ((!disponibilidad.vehiculoDisponible && !mismoVehiculo) ||
        (!disponibilidad.conductorDisponible && !mismoConductor))
    ) {
      toast.error('Vehículo o conductor no disponibles');
      return;
    }

    const res = reserva
      ? await updateReserva(reservaId, data)
      : await createReserva(data);

    if (res.success) {
      toast.success('Reserva guardada correctamente');
      reset();
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
        {!isComprobando &&
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
        {!isComprobando &&
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
          rules={{
            required: 'La fecha de inicio es obligatoria',
            validate: (value) => {
              const fecha = new Date(value);
              const max = new Date('2050-12-31');
              if (fecha > max) return 'No puede ser posterior al año 2050';
              return true;
            }
          }}
          errors={errors}
          disabled={esCancelada}
        />

        <InputField
          label="Fecha de fin"
          name="fechaFin"
          type="date"
          register={register}
          rules={{
            required: 'La fecha de fin es obligatoria',
            validate: (value) => {
              const fecha = new Date(value);
              const max = new Date('2050-12-31');
              if (fecha > max) return 'No puede ser posterior al año 2050';
              return true;
            }
          }}
          errors={errors}
          disabled={esCancelada}
        />

        {esCancelada && (
          <div>
            <label className="text-sm font-medium text-gray-700">Motivo de cancelación</label>
            <textarea
              {...register('motivoCancelacion')}
              rows={3}
              placeholder="Motivo..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <AppButton type="submit" variant="primary">
          Guardar
        </AppButton>
      </div>
    </form>
  );
};

export default ReservaForm;