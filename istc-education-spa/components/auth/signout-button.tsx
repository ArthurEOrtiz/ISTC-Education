"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface SignOutButtonProps {
    callbackUrl?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ callbackUrl = "/"}) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <button 
        onClick={() => {
            setIsLoading(true);
            signOut({ callbackUrl: callbackUrl })
        }} 
        className="btn btn-error text-white">
            {isLoading ? <span className="loading loading-spinner loading-md"></span> : "Sign Out"}
        </button>
    );
}

export default SignOutButton;