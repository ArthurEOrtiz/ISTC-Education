import { ChangeEvent, FocusEvent } from "react";

interface DateInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ label, id, value, onChange, onBlur, error, required }) => (
    <div className={`${required ? 'border border-error rounded-md' : ''} w-full p-1`}>
       <div className="flex items-center justify-between gap-2">
            {label}
            <input 
                type="date" 
                className="input input-bordered w-1/2 max-w-xs" 
                id={id}
                defaultValue={value}
                onChange={onChange}
                onBlur={onBlur}
            />
        </div>
   
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {required && <p className="text-sm text-error mt-1">Required</p>}
    </div>
);

export default DateInput;