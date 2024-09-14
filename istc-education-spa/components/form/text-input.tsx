import { ChangeEvent, FormEvent, FocusEvent, useEffect, useState } from 'react';

interface TextInputProps {
  label: string;
  id: string;
  placeholder: string;
  defaultValue?: string;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, placeholder, defaultValue, onBlur, onChange, onInput, error, required }) => {
    const [value, setValue] = useState<string>('');
    
    useEffect(() =>{
        if(defaultValue){
            setValue(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e);
    }
  
    return (
        <div className={`${required ? 'border border-error rounded-md' : ''} w-full p-1`}>
            <label className="input input-bordered flex items-center gap-2">
                {label}
                <input 
                    type="text" 
                    className="grow" 
                    placeholder={placeholder}
                    id={id}
                    defaultValue={value}
                    onBlur={onBlur}
                    onChange={handleChange}
                    onInput={onInput}
                />
            </label>
            {error && <p className="text-sm text-error mt-1">{error}</p>}
            {required && <p className="text-sm text-error mt-1">Required</p>}
        </div>
    );
};

export default TextInput;