import { useEffect, useMemo, useState } from 'react';
import { getProveedores, deleteProveedor } from '../../api/proveedoresService';
import FormDrawer from '../ui/FormDrawer';
import ProveedorForm from './ProveedorForm';
import { toast } from 'react-toastify';
import AppModal from '../ui/AppModal';
import GenericTable from '../ui/GenericTable';
import TableHeader from '../ui/TableHeader';
import { validateUser } from '../../api/userService';

const ProveedorTable = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [modalBloqueo, setModalBloqueo] = useState({ isOpen: false, mensaje: '', detalles: [] });
  const [userRole, setUserRole] = useState('');

  const cargarProveedores = async () => {
    const res = await getProveedores();
    if (res.success) setProveedores(res.data);
    else toast.error(res.message || 'Error al obtener proveedores');
  };

  useEffect(() => {
    cargarProveedores();
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
    { header: 'NIF', accessorKey: 'nif' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Razón Social', accessorKey: 'razonSocial' },
    { header: 'telefono', accessorKey: 'telefono' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Página Web', accessorKey: 'paginaWeb' },
    { header: 'Direccion', accessorKey: 'direccion' },
    { header: 'Ciudad', accessorKey: 'ciudad' },
    { header: 'Provincia', accessorKey: 'provincia' },
    { header: 'Código Postal', accessorKey: 'codigoPostal' },
    { header: 'Tipo de Proveedor', accessorKey: 'tipo' }
  ], []);

  useEffect(() => {
    const cargarDatos = async () => {
      const res = await validateUser();
      if (res.success) {
        setUserRole(res.user.role);
      }
      await cargarProveedores();
    };

    cargarDatos();
  }, []);

  const eliminarSeleccionados = async () => {
    const seleccionados = Object.keys(rowSelection);
    if (!seleccionados.length) return;

    let algunoEliminado = false;

    for (const rowId of seleccionados) {
      const proveedor = proveedores[rowId];
      const res = await deleteProveedor(proveedor._id);

      if (!res.success && res.vehiculos?.length) {
        setModalBloqueo({
          isOpen: true,
          mensaje: res.message,
          detalles: res.vehiculos,
        });
        return;
      }

      if (res.success) {
        algunoEliminado = true;
      }
    }

    if (algunoEliminado) {
      toast.success('Proveedor(es) eliminado(s)');
      await cargarProveedores();
      setRowSelection({});
    }
  };

  const abrirEdicion = (proveedor) => {
    setProveedorSeleccionado({ ...proveedor });
    setShowForm(true);
  };

  return (
    <div className="w-full">
      <TableHeader
        title="Proveedores"
        onAdd={() => {
          setProveedorSeleccionado(null);
          setShowForm(true);
        }}
        onDelete={eliminarSeleccionados}
        showDelete={userRole === 'admin' && Object.keys(rowSelection).length > 0}
      />

      <GenericTable
        data={proveedores}
        columns={columns}
        onEdit={abrirEdicion}
        onSelectionChange={setRowSelection}
      />

      <FormDrawer
        key={proveedorSeleccionado?._id || 'new'}
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setProveedorSeleccionado(null);
          await cargarProveedores();
        }}
        title={proveedorSeleccionado ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      >
        <ProveedorForm
          proveedor={proveedorSeleccionado}
          onClose={async () => {
            setShowForm(false);
            setProveedorSeleccionado(null);
            await cargarProveedores();
          }}
        />
      </FormDrawer>

      <AppModal
        isOpen={modalBloqueo.isOpen}
        title="No se puede eliminar"
        description={modalBloqueo.mensaje}
        type="confirm"
        confirmText="Aceptar"
        onConfirm={() => setModalBloqueo({ isOpen: false, mensaje: '', detalles: [] })}
        onCancel={() => setModalBloqueo({ isOpen: false, mensaje: '', detalles: [] })}
      />

      {modalBloqueo.detalles.length > 0 && (
        <div className="mt-2 px-4 text-sm text-gray-700">
          <strong>Vehículos asociados:</strong>
          <ul className="list-disc ml-5 mt-1">
            {modalBloqueo.detalles.map((v) => (
              <li key={v.id}>{v.matricula}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProveedorTable;