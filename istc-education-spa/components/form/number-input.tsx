import { handleIntInput } from '@/utils/forms/handlers';
import { ChangeEvent, FocusEvent } from 'react';

interface NumberInputProps {
    label: string;
    id: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, id, value, onChange, onBlur, error, required }) => (
    <div className={`${required ? 'border border-error rounded-md' : ''}  w-full p-1`}>
        <div className="flex items-center justify-between gap-2">
            <span>{label}</span>
            <input 
                type="text" 
                className="input input-bordered w-1/2 max-w-xs" 
                id={id}
                min={1}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                onInput={handleIntInput}
            />
        </div>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {required && <p className="text-sm text-error mt-1">Required</p>}
    </div>
);

export default NumberInput;