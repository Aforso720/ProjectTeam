import React from 'react';

/**
 * Reusable input field component with optional React Hook Form integration.
 * - Supports basic validation via `register`.
 * - Automatically blurs date inputs after selection to close native pickers.
 */
const InputField = ({
  label,
  name,
  type = 'text',
  register,
  validation = {},
  error,
  onChange,
  ...rest
}) => {
  const handleChange = (e) => {
    if (type === 'date' || type === 'datetime-local') {
      // Blur after selecting date to close the picker modal
      e.target.blur();
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        {...(register ? register(name, validation) : {})}
        onChange={handleChange}
        {...rest}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default InputField;
