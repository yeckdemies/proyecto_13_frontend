import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { getReservas, cancelarReserva, reactivarReserva } from '../../api/reservasService';
import ReservaFormDrawer from './ReservaFormDrawer';
import AppModal from '../ui/AppModal';
import { toast } from 'react-toastify';

const ReservasTable = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState([]);
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

  const columns = useMemo(() => [
    { header: 'Vehículo', accessorKey: 'vehiculo.matricula' },
    { header: 'Conductor', accessorKey: 'conductor.nombre' },
    { header: 'Inicio', accessorKey: 'fechaInicio' },
    { header: 'Fin', accessorKey: 'fechaFin' },
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

  const table = useReactTable({
    data: reservas,
    columns,
    state: { rowSelection, pagination, columnFilters, sorting },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
        <button
          onClick={() => {
            setReservaSeleccionada(null);
            setShowForm(true);
          }}
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Añadir Reserva
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-50 text-xs uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 border-b border-gray-200">
                    <div
                      className="cursor-pointer select-none flex items-center gap-1"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: '↑', desc: '↓' }[header.column.getIsSorted()] ?? ''}
                    </div>
                    {header.column.getCanFilter() && (
                      <input
                        type="text"
                        value={header.column.getFilterValue() ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder="Filtrar..."
                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  No hay Reservas disponibles.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 transition cursor-pointer ${row.getIsSelected() ? 'bg-blue-50' : ''}`}
                  onClick={row.getToggleSelectedHandler()}
                  onDoubleClick={() => abrirEdicion(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-b border-gray-200 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer px-2 py-1 border rounded disabled:opacity-40"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer px-2 py-1 border rounded disabled:opacity-40"
          >
            {'<'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="pl-2">Página</span>
          <strong>{table.getState().pagination.pageIndex + 1}</strong>
          <span className="pr-2">de {table.getPageCount()}</span>
        </div>

        <div className="flex items-center gap-2 px-2">
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer px-2 py-1 border rounded disabled:opacity-40"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer px-2 py-1 border rounded disabled:opacity-40"
          >
            {'>>'}
          </button>
        </div>
      </div>

      <ReservaFormDrawer
        key={reservaSeleccionada?._id || 'new'}
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setReservaSeleccionada(null);
          await cargarReservas();
        }}
        reserva={reservaSeleccionada}
      />

      <AppModal
        isOpen={showModal}
        type="prompt"
        title="Cancelar reserva"
        label="Motivo de la cancelación"
        inputRequired
        confirmText="Cancelar"
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
            toast.error(res.message || 'Error al reactivar reserva');
          }
          setShowReactivarModal(false);
          setReservaACancelar(null);
        }}
      />
    </div>
  );
};

export default ReservasTable;
