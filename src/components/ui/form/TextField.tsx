import { ReactNode } from 'react';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: 'text' | 'email' | 'textarea';
  placeholder?: string;
  required?: boolean;
  icon?: ReactNode;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  required = false,
  icon
}: TextFieldProps) {
  const isTextarea = type === 'textarea';
  const isEmpty = value.trim() === '';
  
  return (
    <div className="mb-4">
      {/* Field Label */}
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1">
        {label} {required && isEmpty && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {/* Field Icon (if provided) - positioned differently for textarea vs input */}
        {icon && (
          <div className={`
            absolute left-3 text-zinc-400
            ${isTextarea ? 'top-[14px]' : 'top-1/2 -translate-y-1/2'}
          `}>
            {icon}
          </div>
        )}
        
        {/* Textarea Field */}
        {isTextarea ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`
              /* [Text Area] Styled textarea input field */
              w-full py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3
              bg-zinc-800/50 border ${error ? 'border-red-500' : 'border-zinc-700'} 
              rounded-md text-zinc-200
              focus:outline-none focus:ring-1 focus:ring-yellow-500
            `}
            rows={5}
          />
        ) : (
          /* Text Input Field */
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`
              /* [Text Input] Styled text input field */
              w-full py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3
              bg-zinc-800/50 border ${error ? 'border-red-500' : 'border-zinc-700'} 
              rounded-md text-zinc-200
              focus:outline-none focus:ring-1 focus:ring-yellow-500
            `}
          />
        )}
      </div>
      
      {/* Error Message (if any) */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
} 