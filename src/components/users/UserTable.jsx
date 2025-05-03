import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { getUsers, deleteUser } from '../../api/userService';
import UserFormDrawer from './UserFormDrawer';
import { toast } from 'react-toastify';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState([]);

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

  const table = useReactTable({
    data: users,
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

  const eliminarSeleccionados = async () => {
    const seleccionados = table.getSelectedRowModel().rows;
    if (!seleccionados.length) return;

    if (!confirm(`¿Eliminar ${seleccionados.length} user(s)?`)) return;

    const resultados = await Promise.all(
      seleccionados.map((row) => deleteUser(row.original._id))
    );

    const exitosos = resultados.filter(r => r.success);
    const fallidos = resultados.filter(r => !r.success);
    if (exitosos.length) {
      toast.success(`Se eliminaron ${exitosos.length} usuario(s) correctamente`);
    }

    if (fallidos.length) {
      toast.error(`Error al eliminar ${fallidos.length} usuario(s): ${fallidos.map(f => f.message).join(', ')}`);
    }

    table.resetRowSelection();
    await cargarUsers();
  };

  const abrirEdicion = (user) => {
    setUserSeleccionado({
      ...user,
    });
    setShowForm(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <div className="flex gap-2">
          {Object.keys(rowSelection).length > 0 && (
            <button
              onClick={eliminarSeleccionados}
              className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar seleccionados
            </button>
          )}
          <button
            onClick={() => {
              setUserSeleccionado(null);
              setShowForm(true);
            }}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Añadir Usuario
          </button>
        </div>
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
                  No hay usuarios disponibles.
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

      <UserFormDrawer
        key={userSeleccionado?._id || 'new'}
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setUserSeleccionado(null);
          await cargarUsers();
        }}
        user={userSeleccionado}
      />
    </div>
  );
};

export default UserTable;
