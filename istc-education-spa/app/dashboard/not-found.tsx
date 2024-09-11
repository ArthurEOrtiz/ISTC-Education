const DashboardNotFound: React.FC = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center space-y-2">
            <p className="text-3xl font-bold text-error">404 Not Found</p>
            <div className="border p-4 rounded-md">
                <p>Sorry, there was a problem resolving your autherization.</p>
            </div>
        </div>
    );
}

export default DashboardNotFound;