import React from 'react';

interface SelectInputProps {
    id: string;
    options: string[];
    value?: string;
    onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ id, options, value: incomingValue, onBlur, onChange, error, required }) => {
    const [ value, setValue ] = React.useState<string>('');
    const [ selection, setSelection ] = React.useState<string[]>(options);

    React.useEffect(() => {
        if (incomingValue) {
            setValue(incomingValue);
        }
        setSelection(options);
    }, [incomingValue, options]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value);
        onChange(e);
    }
    
    return (
        <div className={`${required ? 'border border-error rounded-md' : ''} p-1`}>
            <select 
                id={id}
                value={value}
                onBlur={onBlur}
                onChange={handleChange}
                className="select select-bordered w-full"
            >
                {selection.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
            {error && <p className="text-sm text-error mt-1">{error}</p>}
            {required && <p className="text-sm text-error mt-1">Required</p>}
        </div>
    );
};

export default SelectInput;