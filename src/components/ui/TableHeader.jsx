const TableHeader = ({ title, onAdd, onDelete, showDelete }) => (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex gap-2">
      {showDelete && (
        <button onClick={onDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Eliminar seleccionados
        </button>
      )}
      <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Añadir {title}
      </button>
    </div>
  </div>
);

export default TableHeader;