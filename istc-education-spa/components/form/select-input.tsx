import { on } from "events";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";

interface SelectInputProps {
    id: string;
    options?: string[];
    children?: React.ReactNode; 
    value?: string;
    onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ id, options, children, value, onBlur, onChange, error, required }) => (
    <div className={`${required ? 'border border-error rounded-md' : ''} p-1`}>
        <select 
            id={id}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            className="select select-bordered w-full"
        >
            {options && options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}

            {children && children}
            
        </select>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
        {required && <p className="text-sm text-error mt-1">Required</p>}
    </div>
);


export default SelectInput;