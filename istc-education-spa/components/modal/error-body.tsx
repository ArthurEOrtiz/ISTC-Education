interface ErrorBodyProps {
    errors: string | ErrorResponse;
}

const ErrorBody: React.FC<ErrorBodyProps> = ({ errors }) => {
    return (
        <div className="bg-error-content border border-white rounded-md p-4">
            {typeof errors === "string" ? (
                <p className="text-error">{errors}</p>
            ) : (
                <ul className="text-error">
                    {Object.entries(errors as ErrorResponse).map(([key, value]) => (
                        <li key={key}>{value.join(' ')}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ErrorBody;