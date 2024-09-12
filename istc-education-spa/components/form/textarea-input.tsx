import { ChangeEvent, FocusEvent, useEffect, useState } from "react";

interface TextAreaInputProps {
    id: string;
    placeholder: string;    
    value?: string;
    onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    required?: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, placeholder, value: incomingValue, onBlur, onChange, error, required }) => {
    const [ value, setValue ] = useState<string>('');
    
   useEffect(() => {
        if (incomingValue) {
            setValue(incomingValue);
        }
    }, [incomingValue]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        onChange(e);
    }
    
    return (
        <div className={`${required ? 'border border-error rounded-md' : ''} p-1`}>
            <textarea 
                id={id}
                value={value}
                placeholder={placeholder}
                onBlur={onBlur}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
            />
            {error && <p className="text-sm text-error mt-1">{error}</p>}
            {required && <p className="text-sm text-error mt-1">Required</p>}
        </div>
    );
};

export default TextAreaInput;