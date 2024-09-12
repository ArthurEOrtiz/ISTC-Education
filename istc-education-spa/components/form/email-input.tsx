import { ChangeEvent, FocusEvent } from "react";

interface EmailInputProps {
    label: string;
    id: string;
    placeholder: string;
    defaultValue?: string;
    onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    isEmailChecking?: boolean;
    required?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({ label, id, placeholder, defaultValue, onBlur, onChange, error, isEmailChecking, required }) => (
    <div className={`${required ? 'border border-error rounded-md' : ''} p-1`}>
        <label className="input input-bordered flex items-center gap-2">
            {label}
            <input 
                type="email" 
                className="grow" 
                placeholder={placeholder}
                id={id}
                defaultValue={defaultValue}
                onBlur={onBlur}
                onChange={onChange}
            />
        </label>
        {isEmailChecking && (
            <div className="flex items-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                <p className="text-sm text-success mt-1">Checking email...</p>
            </div>
        )}
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {required && <p className="text-sm text-error mt-1">Required</p>}
    </div>
);

export default EmailInput;