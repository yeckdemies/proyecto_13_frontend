import React from 'react';

export const InputField = ({
  label,
  name,
  register,
  rules = {},
  type = 'text',
  errors,
  disabled = false,
}) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
      {rules.required && <span className="text-red-500"> *</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      disabled={disabled}
      {...register(name, rules)}
      className={`mt-1 block w-full rounded-md border ${
        type === 'file' ? 'p-1' : 'px-3 py-2'
      } border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100`}
    />
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

export const SelectField = ({ label, name, options, register, required = false, errors, disabled = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <select
      {...register(name, required ? { required: 'Campo requerido' } : {})}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
    >
      <option value="">Seleccionar</option>
      {options.map((opt) => (
        <option
          key={typeof opt === 'string' ? opt : opt.value}
          value={typeof opt === 'string' ? opt : opt.value}
        >
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
    {errors?.[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);