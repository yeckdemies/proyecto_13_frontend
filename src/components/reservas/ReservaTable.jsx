import { useEffect, useMemo, useState } from 'react';
import { getReservas, cancelarReserva, reactivarReserva } from '../../api/reservasService';
import FormDrawer from '../ui/FormDrawer';
import ReservaForm from './ReservaForm';
import AppModal from '../ui/AppModal';
import { toast } from 'react-toastify';
import GenericTable from '../ui/GenericTable';
import TableHeader from '../ui/TableHeader';

const ReservasTable = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const [showReactivarModal, setShowReactivarModal] = useState(false);

  const cargarReservas = async () => {
    const res = await getReservas();
    if (res.success) setReservas(res.data);
    else toast.error(res.message || 'Error al obtener reservas');
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const abrirEdicion = (reserva) => {
    setReservaSeleccionada({
      ...reserva,
      fechaInicio: reserva.fechaInicio?.substring(0, 10),
      fechaFin: reserva.fechaFin?.substring(0, 10),
      vehiculo: reserva.vehiculo?._id ?? reserva.vehiculo,
      conductor: reserva.conductor?._id ?? reserva.conductor,
    });
    setShowForm(true);
  };

  const columns = useMemo(() => [
    { header: 'Vehículo', accessorKey: 'vehiculo.matricula' },
    { header: 'Conductor', accessorKey: 'conductor.nombre' },
    {
      header: 'Inicio',
      accessorKey: 'fechaInicio',
      cell: ({ getValue }) => {
        const raw = getValue();
        if (!raw) return '—';
        const date = new Date(raw);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
      },
    },
    {
      header: 'Fin',
      accessorKey: 'fechaFin',
      cell: ({ getValue }) => {
        const raw = getValue();
        if (!raw) return '—';
        const date = new Date(raw);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
      },
    },
    { header: 'Estado', accessorKey: 'estado' },
    {
      id: 'acciones',
      header: '',
      accessorKey: 'acciones',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => {
        const estado = row.original.estado;
        if (estado === 'Activa') {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReservaACancelar(row.original);
                setShowModal(true);
              }}
              className="cursor-pointer text-red-600 text-lg font-bold"
              title="Cancelar reserva"
            >
              ❌
            </button>
          );
        } else if (estado === 'Cancelada') {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReservaACancelar(row.original);
                setShowReactivarModal(true);
              }}
              className="cursor-pointer text-green-600 text-lg font-bold"
              title="Reactivar reserva"
            >
              🔄
            </button>
          );
        } else {
          return '';
        }
      }
    }
  ], []);

  return (
    <div className="w-full">
      <TableHeader
        title="Reservas"
        onAdd={() => {
          setReservaSeleccionada(null);
          setShowForm(true);
        }}
      />

      <GenericTable
        data={reservas}
        columns={columns}
        onEdit={abrirEdicion}
      />

      <FormDrawer
        key={reservaSeleccionada?._id ?? 'new'}
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setReservaSeleccionada(null);
          await cargarReservas();
        }}
        title={reservaSeleccionada ? 'Editar Reserva' : 'Nueva Reserva'}
      >
        <ReservaForm
          reserva={reservaSeleccionada}
          onClose={async () => {
            setShowForm(false);
            setReservaSeleccionada(null);
            await cargarReservas();
          }}
        />
      </FormDrawer>

      {/* Modal para cancelar */}
      <AppModal
        isOpen={showModal}
        type="prompt"
        title="Cancelar reserva"
        label="Motivo de la cancelación"
        inputRequired
        confirmText="Aceptar"
        cancelText="Cerrar"
        onCancel={() => {
          setShowModal(false);
          setReservaACancelar(null);
        }}
        onConfirm={async (motivo) => {
          if (!reservaACancelar) return;
          const res = await cancelarReserva(reservaACancelar._id, motivo);
          if (res.success) {
            toast.success('Reserva cancelada');
            await cargarReservas();
          } else {
            toast.error(res.message || 'Error al cancelar reserva');
          }
          setShowModal(false);
          setReservaACancelar(null);
        }}
      />

      {/* Modal para reactivar */}
      <AppModal
        isOpen={showReactivarModal}
        type="confirm"
        title="Reactivar reserva"
        message="¿Estás seguro de que deseas reactivar esta reserva?"
        confirmText="Reactivar"
        cancelText="Cancelar"
        onCancel={() => {
          setShowReactivarModal(false);
          setReservaACancelar(null);
        }}
        onConfirm={async () => {
          if (!reservaACancelar) return;
          const res = await reactivarReserva(reservaACancelar._id);
          if (res.success) {
            toast.success('Reserva reactivada');
            await cargarReservas();
          } else {
            if (res.message?.includes('vehículo')) {
              toast.error('No se puede reactivar: el vehículo ya está reservado en ese rango.');
            } else if (res.message?.includes('conductor')) {
              toast.error('No se puede reactivar: el conductor ya tiene otra reserva en ese rango.');
            } else {
              toast.error(res.message || 'Error al reactivar reserva');
            }
          }
          setShowReactivarModal(false);
          setReservaACancelar(null);
        }}
      />
    </div>
  );
};

export default ReservasTable;