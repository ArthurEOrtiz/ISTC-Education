import { User } from "@/types/user";
import { agent, headers, rootUrl } from "./httpConfig";
import fetch from 'node-fetch'

export const getUserIndex = async () => {
    const response = await fetch(`${rootUrl}/user`, {
        method: 'GET',
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users data');
    }

    const data = await response.json();

    return data;
}

export const getUser = async (id: number) => {
    const response = await fetch(`${rootUrl}/user/${id}`, {
        method: 'GET',
        headers,
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    const data = await response.json();

    return data;
}

export const createUser = async (user: User) => {
    const response = await fetch(`${rootUrl}/user/${user.userId}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(user),
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    const data = await response.json();

    return data;
}

export const updateUser = async (user: User) => {
    const response = await fetch(`${rootUrl}/user/${user.userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(user),
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    const data = await response.json();

    return data;
}

export const deleteUser = async (id: number) => {
    const response = await fetch(`${rootUrl}/user/${id}`, {
        method: 'DELETE',
        headers,
        agent
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    const data = await response.json();

    return data;
}





