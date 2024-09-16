interface NotFoundProps {
    children: React.ReactNode;
}

const NotFound: React.FC<NotFoundProps> = ({ children }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center space-y-2">
            <p className="text-3xl font-bold text-error">404 Not Found</p>
            <div className="border p-4 rounded-md">
                {children}
            </div>
        </div>
    );
}

export default NotFound;