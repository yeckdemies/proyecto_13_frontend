import { useEffect, useMemo, useState } from 'react';
import { getUsers, deleteUser } from '../../api/userService';
import FormDrawer from '../ui/FormDrawer';
import UserForm from './UserForm';
import { toast } from 'react-toastify';
import GenericTable from '../ui/GenericTable';
import TableHeader from '../ui/TableHeader';
import AppModal from '../ui/AppModal';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [modalEliminar, setModalEliminar] = useState(false);

  const cargarUsers = async () => {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    const res = await getUsers(currentUser?.email);
    if (res.success) setUsers(res.data);
    else toast.error(res.message || 'Error al obtener los usuarios');
  };

  useEffect(() => {
    cargarUsers();
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
    { header: 'Username', accessorKey: 'userName' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Rol', accessorKey: 'role' },
  ], []);

  const confirmarEliminacion = () => {
    if (Object.keys(rowSelection).length > 0) {
      setModalEliminar(true);
    }
  };

  const eliminarSeleccionados = async () => {
    const seleccionados = Object.keys(rowSelection);
    if (!seleccionados.length) return;

    const resultados = await Promise.all(
      seleccionados.map((rowId) => deleteUser(users[rowId]._id))
    );

    const exitosos = resultados.filter(r => r.success);
    const fallidos = resultados.filter(r => !r.success);

    if (exitosos.length) {
      toast.success(`Se eliminaron ${exitosos.length} usuario(s) correctamente`);
    }

    if (fallidos.length) {
      toast.error(`Error al eliminar ${fallidos.length} usuario(s): ${fallidos.map(f => f.message).join(', ')}`);
    }

    setRowSelection({});
    setModalEliminar(false);
    await cargarUsers();
  };

  const abrirEdicion = (user) => {
    setUserSeleccionado({ ...user });
    setShowForm(true);
  };

  return (
    <div className="w-full">
      <TableHeader
        title="Usuarios"
        onAdd={() => {
          setUserSeleccionado(null);
          setShowForm(true);
        }}
        onDelete={confirmarEliminacion}
        showDelete={Object.keys(rowSelection).length > 0}
      />

      <GenericTable
        data={users}
        columns={columns}
        onEdit={abrirEdicion}
        onSelectionChange={setRowSelection}
      />

      <FormDrawer
        key={userSeleccionado?._id || 'new'}
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setUserSeleccionado(null);
          await cargarUsers();
        }}
        title={userSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UserForm
          user={userSeleccionado}
          onClose={async () => {
            setShowForm(false);
            setUserSeleccionado(null);
            await cargarUsers();
          }}
        />
      </FormDrawer>

      <AppModal
        isOpen={modalEliminar}
        type="confirm"
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar ${Object.keys(rowSelection).length} usuario(s)?`}
        confirmText="Aceptar"
        cancelText="Cancelar"
        onCancel={() => setModalEliminar(false)}
        onConfirm={eliminarSeleccionados}
      />
    </div>
  );
};

export default UserTable;