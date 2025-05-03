import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useState } from 'react';

const GenericTable = ({
  data,
  columns,
  onEdit,
  pageSize = 15,
  onSelectionChange,
  renderActions,
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, pagination, columnFilters, sorting },
    onRowSelectionChange: (s) => {
      setRowSelection(s);
      onSelectionChange?.(s);
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-50 text-xs uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 border-b border-gray-200">
                    <div
                      className="cursor-pointer flex items-center gap-1 select-none"
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
                  No hay datos disponibles.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 cursor-pointer transition ${row.getIsSelected() ? 'bg-blue-50' : ''}`}
                  onClick={row.getToggleSelectedHandler()}
                  onDoubleClick={() => onEdit?.(row.original)}
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
      {renderActions?.(table)}
    </>
  );
};

export default GenericTable;