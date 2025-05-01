import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { getProveedores, deleteProveedor } from '../../api/proveedoresService';
import ProveedorFormDrawer from './ProveedorFormDrawer';
import { toast } from 'react-toastify';

const ProveedorTable = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [sorting, setSorting] = useState([]);

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
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 40
    },
    { header: 'DNI', accessorKey: 'dni' },
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'fechaNacimiento', accessorKey: 'fechaNacimiento' },
    { header: 'telefono', accessorKey: 'telefono' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Ciudad', accessorKey: 'ciudad' },
    { header: 'Provincia', accessorKey: 'provincia' },
    { header: 'Direccion', accessorKey: 'direccion' },
    { header: 'Código Postal', accessorKey: 'codigoPostal' },
  ], []);

  const table = useReactTable({
    data: proveedores,
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

    if (!confirm(`¿Eliminar ${seleccionados.length} proveedor(es)?`)) return;

    for (const row of seleccionados) {
      await deleteProveedor(row.original._id);
    }

    toast.success('Proveedores eliminados correctamente');
    table.resetRowSelection();
    await cargarProveedores();
  };

  const abrirEdicion = (proveedor) => {
    setProveedorSeleccionado({
      ...proveedor,
    });
    setShowForm(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Proveedores</h1>
        <div className="flex gap-2">
          {Object.keys(rowSelection).length > 0 && (
            <button
              onClick={eliminarSeleccionados}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar seleccionados
            </button>
          )}
          <button
            onClick={() => {
              setProveedorSeleccionado(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Añadir Proveedor
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition cursor-pointer"
                onDoubleClick={() => abrirEdicion(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-b border-gray-200 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-40"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-40"
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
            className="px-2 py-1 border rounded disabled:opacity-40"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-40"
          >
            {'>>'}
          </button>
        </div>
      </div>

      <ProveedorFormDrawer
        isOpen={showForm}
        onClose={async () => {
          setShowForm(false);
          setProveedorSeleccionado(null);
          await cargarProveedores();
        }}
        proveedor={proveedorSeleccionado}
      />
    </div>
  );
};

export default ProveedorTable;
