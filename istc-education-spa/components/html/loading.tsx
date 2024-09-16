interface LoadingProps {
    children: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({ children }) => {
    return (
        <div className="w-full flex flex-col justify-center items-center space-y-2">
            <p className="text-3xl font-bold">{children}</p>
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}

export default Loading;