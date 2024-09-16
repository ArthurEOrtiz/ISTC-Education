import { ChangeEvent, FocusEvent } from "react";

interface TextAreaInputProps {
    id: string;
    placeholder: string;    
    value?: string;
    defaultValue?: string;
    onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    required?: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, placeholder, value, defaultValue, onBlur, onChange, error, required }) => (
    <div className={`${required ? 'border border-error rounded-md' : ''} p-1`}>
        <textarea 
            id={id}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            rows={5}
            onBlur={onBlur}
            onChange={onChange}
            className="textarea textarea-bordered w-full"
        />
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {required && <p className="text-sm text-error mt-1">Required</p>}
    </div>
);


export default TextAreaInput;