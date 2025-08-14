export default function FormField({
    isVisible,
    setIsVisible,
    label,
    type,
    placeholder,
    id,
    register,
    errors,
    name,
    classname,
    disabled = false,
  }) {
    const toggleVisibility = () => setIsVisible?.((prev) => !prev);
    return (
      <div className={classname}>
        <fieldset className="fieldset relative">
          <legend className="fieldset-legend">{label}</legend>
          <input
            type={isVisible ? "text" : type}
            placeholder={placeholder}
            className={`input input-md w-full ${
              errors?.[name] && "border-red-600"
            }`}
            id={id}
            {...register(name)}
            disabled={disabled}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-2 text-xs border-0 focus:outline-none font-semibold cursor-pointer"
              onClick={toggleVisibility}
            >
              {isVisible ? "Hide" : "Show"}
            </button>
          )}
        </fieldset>
        {errors?.[name]?.message && (
          <div className="text-xs text-red-600">{errors?.[name]?.message}</div>
        )}
      </div>
    );
  }
  