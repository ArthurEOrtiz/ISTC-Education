"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

const SignInButton: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <button 
        onClick={() => {
            setIsLoading(true);
            signIn("azure-ad-b2c");
        }} 
        className="btn btn-success text-white">
            {isLoading ? <span className="loading loading-spinner loading-md"></span> : "Sign In"}
        </button>
    );
}

export default SignInButton;