interface ErrorBodyProps {
    errors: string | ErrorResponse;
}

const ErrorBody: React.FC<ErrorBodyProps> = ({ errors }) => {
    return (
        <div>
            {typeof errors === "string" ? (
                <p className="text-warning">{errors}</p>
            ) : (
                <ul className="text-warning">
                    {Object.entries(errors as ErrorResponse).map(([key, value]) => (
                        <li key={key}>{value.join(' ')}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ErrorBody;