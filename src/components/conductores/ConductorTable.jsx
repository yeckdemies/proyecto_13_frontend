import { useEffect, useMemo, useState } from 'react';
import { getConductores, deleteConductor } from '../../api/conductoresService';
import FormDrawer from '../ui/FormDrawer';
import ConductorForm from './ConductorForm';
import AppModal from '../ui/AppModal';
import TableHeader from '../ui/TableHeader';
import GenericTable from '../ui/GenericTable';
import { toast } from 'react-toastify';

const ConductoresTable = () => {
  const [conductores, setConductores] = useState([]);
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [modal, setModal] = useState({ isOpen: false, ids: [] });

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40,
    },
    { header: 'DNI', accessorKey: 'dni' },
    { header: 'Nombre', accessorKey: 'nombre' },
    {
      header: 'Fecha Nacimiento',
      accessorKey: 'fechaNacimiento',
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
    { header: 'Teléfono', accessorKey: 'telefono' },
    { header: 'Email', accessorKey: 'email' },
  ], []);

  const cargarConductores = async () => {
    const res = await getConductores();
    if (res.success) setConductores(res.data);
    else toast.error(res.message || 'Error al obtener conductores');
  };

  useEffect(() => {
    cargarConductores();
  }, []);

  const eliminarSeleccionados = async () => {
    const seleccionados = Object.keys(rowSelection);
    const conReservas = [];

    for (const id of seleccionados) {
      const res = await deleteConductor(id);
      if (!res.success && res.reservas?.length) conReservas.push(id);
    }

    if (conReservas.length) {
      setModal({ isOpen: true, ids: conReservas });
    } else {
      toast.success('Conductores eliminados');
      setRowSelection({});
      await cargarConductores();
    }
  };

  return (
    <div className="w-full">
      <TableHeader
        title="Conductores"
        onAdd={() => {
          setConductorSeleccionado(null);
          setShowForm(true);
        }}
        onDelete={eliminarSeleccionados}
        showDelete={Object.keys(rowSelection).length > 0}
      />

      <GenericTable
        data={conductores}
        columns={columns}
        onEdit={(item) => {
          setConductorSeleccionado({
            ...item,
            fechaNacimiento: item.fechaNacimiento?.substring(0, 10),
          });
          setShowForm(true);
        }}
        onSelectionChange={setRowSelection}
      />

      <FormDrawer
        key={conductorSeleccionado?._id || 'new'}
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setConductorSeleccionado(null);
          cargarConductores();
        }}
        title={conductorSeleccionado ? 'Editar Conductor' : 'Nuevo Conductor'}
      >
        <ConductorForm
          conductor={conductorSeleccionado}
          onClose={() => {
            setShowForm(false);
            setConductorSeleccionado(null);
            cargarConductores();
          }}
        />
      </FormDrawer>

      <AppModal
        isOpen={modal.isOpen}
        title="Reservas asociadas encontradas"
        description="¿Deseas eliminar también esas reservas?"
        onCancel={() => setModal({ isOpen: false, ids: [] })}
        onConfirm={async () => {
          for (const id of modal.ids) {
            await deleteConductor(id, true);
          }
          setModal({ isOpen: false, ids: [] });
          await cargarConductores();
        }}
      />
    </div>
  );
};

export default ConductoresTable;