import { useRouter } from "next/router";

const RouterTest:React.FC = () => {
    const router = useRouter();
    return (
        <div className="flex w-full justify-center items-center">
        <h1>Router Test</h1>
        <button onClick={() => router.push("/test")}>Go to Test Page</button>
        </div>
    );
};

export default RouterTest;