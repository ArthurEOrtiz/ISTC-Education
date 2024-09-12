import { FocusEvent } from "react";
import PhoneInput from "react-phone-number-input/input";

interface PhoneInputProps {
    label: string;
    id: string;
    defaultCountry: string;
    value: string;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;   
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({ label, id, defaultCountry, value, onBlur, onChange, error, required }) => (
    <div className={`${required ? 'border border-error rounded-md' : ''} p-1`}>
        <label className="input input-bordered flex items-center gap-2 w-full">
            {label}
            <PhoneInput 
                type="text" 
                className="w-full" 
                placeholder="(208)-123-4567" 
                id={id}
                defaultCountry={defaultCountry as any}
                value={value}
                onBlur={onBlur}   
                onChange={onChange as any}
            />
        </label>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {required && <p className="text-sm text-error mt-1">Required</p>}
    </div>
);

export default CustomPhoneInput;