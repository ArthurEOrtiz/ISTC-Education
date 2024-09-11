const LoadingDashBoard: React.FC = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center space-y-2">
            <p className="text-3xl font-bold">Loading DashBoard...</p>
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}

export default LoadingDashBoard;