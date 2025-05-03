import AppButton from "./AppButton";

const TableHeader = ({ title, onAdd, onDelete, showDelete }) => (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      {showDelete && (
        <AppButton onClick={onDelete} variant="danger" fullWidth>
          Eliminar seleccionados
        </AppButton>
      )}
      <AppButton onClick={onAdd} variant="primary" fullWidth>
        Añadir {title}
      </AppButton>
    </div>
  </div>
);

export default TableHeader;