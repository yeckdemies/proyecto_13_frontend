import { useEffect, useMemo, useState } from 'react';
import { getVehiculos, deleteVehiculo } from '../../api/vehiculosService';
import FormDrawer from '../ui/FormDrawer';
import VehiculoForm from './VehiculoForm';
import { toast } from 'react-toastify';
import AppModal from '../ui/AppModal';
import GenericTable from '../ui/GenericTable';
import TableHeader from '../ui/TableHeader';

const VehiculosTable = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [modalConfirmacion, setModalConfirmacion] = useState({ isOpen: false, ids: [] });

  const cargarVehiculos = async () => {
    const res = await getVehiculos();
    if (res.success) setVehiculos(res.data);
    else toast.error(res.message || 'Error al obtener vehículos');
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onClick={(e) => e.stopPropagation()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40
    },
    { header: 'Matrícula', accessorKey: 'matricula' },
    { header: 'Marca', accessorKey: 'marca' },
    { header: 'Tipo', accessorKey: 'tipoVehiculo' },
    { header: 'Combustible', accessorKey: 'tipoCombustible' },
    { header: 'Estado', accessorKey: 'estado' },
    { header: 'Coste Mensual', accessorKey: 'costeAlquilerMensual' },
    {
      header: 'Fecha ITV',
      accessorKey: 'fechaVigorItv',
      cell: ({ getValue }) => {
        const raw = getValue();
        if (!raw) return '—';
        const date = new Date(raw);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
      }
    },
    {
      header: 'Inicio Renting',
      accessorKey: 'fechaInicioContratoRenting',
      cell: ({ getValue }) => {
        const raw = getValue();
        if (!raw) return '—';
        const date = new Date(raw);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
      }
    },
    {
      header: 'Fin Renting',
      accessorKey: 'fechaFinContratoRenting',
      cell: ({ getValue }) => {
        const raw = getValue();
        if (!raw) return '—';
        const date = new Date(raw);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const anio = date.getFullYear();
        return `${dia}/${mes}/${anio}`;
      }
    },
    {
      header: 'Permiso',
      accessorKey: 'permisoCirculacionUrl',
      cell: ({ row }) =>
        row.original.permisoCirculacionUrl ? (
          <a
            href={row.original.permisoCirculacionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver
          </a>
        ) : (
          '-'
        )
    },
    {
      header: 'Proveedor',
      accessorFn: row => row.proveedor?.nombre ?? '-'
    }
  ], []);

  const eliminarSeleccionados = async () => {
    const seleccionados = Object.keys(rowSelection);
    if (!seleccionados.length) return;

    const conReservas = [];

    for (const rowId of seleccionados) {
      const vehiculo = vehiculos[rowId];
      const res = await deleteVehiculo(vehiculo._id);
      if (!res.success && res.reservas?.length) {
        conReservas.push(vehiculo._id);
      }
    }

    if (conReservas.length > 0) {
      setModalConfirmacion({ isOpen: true, ids: conReservas });
    } else {
      toast.success('Vehículos eliminados correctamente');
      setRowSelection({});
      await cargarVehiculos();
    }
  };

  const abrirEdicion = (vehiculo) => {
    setVehiculoSeleccionado({
      ...vehiculo,
      proveedor: vehiculo.proveedor?._id ?? vehiculo.proveedor,
      fechaVigorItv: vehiculo.fechaVigorItv?.substring(0, 10),
      fechaInicioContratoRenting: vehiculo.fechaInicioContratoRenting?.substring(0, 10),
      fechaFinContratoRenting: vehiculo.fechaFinContratoRenting?.substring(0, 10),
    });
    setShowForm(true);
  };

  return (
    <div className="w-full">
      <TableHeader
        title="Vehículos"
        onAdd={() => {
          setVehiculoSeleccionado(null);
          setShowForm(true);
        }}
        onDelete={eliminarSeleccionados}
        showDelete={Object.keys(rowSelection).length > 0}
      />

      <GenericTable
        data={vehiculos}
        columns={columns}
        onEdit={abrirEdicion}
        onSelectionChange={setRowSelection}
      />

      <FormDrawer
        key={vehiculoSeleccionado?._id || 'new'}
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setVehiculoSeleccionado(null);
          await cargarVehiculos();
        }}
        title={vehiculoSeleccionado ? 'Editar Vehículo' : 'Nuevo Vehículo'}
      >
        <VehiculoForm
          vehiculo={vehiculoSeleccionado}
          onClose={async () => {
            setShowForm(false);
            setVehiculoSeleccionado(null);
            await cargarVehiculos();
          }}
        />
      </FormDrawer>

      <AppModal
        isOpen={modalConfirmacion.isOpen}
        title="Reservas asociadas encontradas"
        description="Algunos de los vehículos seleccionados tienen reservas. ¿Deseas eliminar también esas reservas?"
        onCancel={() => setModalConfirmacion({ isOpen: false, ids: [] })}
        onConfirm={async () => {
          for (const id of modalConfirmacion.ids) {
            await deleteVehiculo(id, true);
          }
          toast.success('Vehículos y reservas eliminados');
          setModalConfirmacion({ isOpen: false, ids: [] });
          setRowSelection({});
          await cargarVehiculos();
        }}
      />
    </div>
  );
};

export default VehiculosTable;