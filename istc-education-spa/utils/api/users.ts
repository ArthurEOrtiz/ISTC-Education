import { agent } from "./agent";
import fetch from 'node-fetch'

export const getUserIndex = async () => {
    const response = await fetch('https://localhost:7180/api/user', {
        method: 'GET',
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users data');
    }

    const data = await response.json();

    return data;
}

export const getUser = async (id: string) => {
    const response = await fetch(`https://localhost:7180/api/user/${id}`, {
        method: 'GET',
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    const data = await response.json();

    return data;
}

export const createUser = async (user: any) => {
    const response = await fetch('https://localhost:7180/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    const data = await response.json();

    return data;
}





