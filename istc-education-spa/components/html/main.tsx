interface MainProps {
    children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
    return (
        <main className="bg-primary-content flex-grow flex p-4">
            {children}
        </main>
    );
}

export default Main;