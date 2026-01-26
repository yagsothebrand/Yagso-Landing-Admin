export function Field({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full rounded-xl border border-gray-200 bg-white
            px-10 py-3 text-gray-900 placeholder:text-gray-400
            outline-none focus:border-gray-300 focus:ring-2 focus:ring-[#2b6f99]/15
            transition
          "
        />
      </div>
    </div>
  );
}

export function FieldTextArea({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-4 text-gray-400">{icon}</span>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={5}
          placeholder={placeholder}
          className="
            w-full rounded-xl border border-gray-200 bg-white
            px-10 py-3 text-gray-900 placeholder:text-gray-400
            outline-none resize-none
            focus:border-gray-300 focus:ring-2 focus:ring-[#fc7182]/15
            transition
          "
        />
      </div>
    </div>
  );
}
