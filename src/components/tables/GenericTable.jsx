import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import DotsLoader from '../DotsLoader';

const GenericTable = ({ columns, dataUrl, data: externalData, title }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (externalData) {
        setData(externalData);
        setLoading(false);
        return;
      }

      if (dataUrl) {
        try {
          const res = await axios.get(dataUrl);
          setData(res.data);
        } catch (err) {
          console.error(`Error al cargar ${title}`, err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dataUrl, externalData, title]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-500">
      <DotsLoader />
    </div>
  );


  return (
    <div className="w-full overflow-x-auto">
      {title && <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>}

      <div className="rounded-xl border border-gray-100 bg-white shadow overflow-hidden">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-white text-xs font-semibold text-gray-700 uppercase">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 whitespace-nowrap border-b border-gray-100">
                    <div
                      className="flex items-center justify-between gap-2 cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted()] ?? ''}
                    </div>
                    {header.column.getCanFilter() && (
                      <input
                        type="text"
                        value={header.column.getFilterValue() ?? ''}
                        onChange={(e) => header.column.setFilterValue(e.target.value)}
                        placeholder="Filtrar..."
                        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-3 whitespace-nowrap text-sm border-b border-gray-100">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 rounded-md border bg-white text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 rounded-md border bg-white text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>

        <div className="text-sm text-gray-600">
          Página <strong>{table.getState().pagination.pageIndex + 1}</strong> de <strong>{table.getPageCount()}</strong>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mostrar</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-white"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">registros</span>
        </div>
      </div>
    </div>
  );
};

export default GenericTable;