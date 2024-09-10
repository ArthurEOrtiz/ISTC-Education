'use server';
import { User } from "@/types/user";
import { axiosInstance } from "./httpConfig";
import axios from "axios";

export const getAllUsers = async () => {
    const users: User[] = await axiosInstance.get('/User')
        .then((response) => { return response.data})
        .catch((error) => { throw error });
    return users;
}

export const getUser = async (id: number) => {
    const user: User | null = await axiosInstance.get(`/User/${id}`)
        .then((response) => {return response.data as User})
        .catch((error) => { 
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            } else {
                throw error;
            }
        });
    return user;
}

export const getUserByEmail = async (email: string) => {
    const user: User | null = await axiosInstance.get(`/User/Email/${email}`)
        .then((response) => response.data as User)
        .catch((error) => { 
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            } else {
                throw error;
            }
        });
    return user;
}

export const getUserByIpId = async (IPId: string) => {
    const user: User | null = await axiosInstance.get(`/User/IPId/${IPId}`)
        .then((response) => {return response.data as User})
        .catch((error) => { 
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            } else {
                throw error;
            }
        });
    return user;
}

export const postUser = async (user: User): Promise<{ success: boolean; error?: string }> => {
    try {
        const response = await axiosInstance.post('/User', user);
        if (response.status === 201) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const data = error.response.data as ErrorResponse;
                if (data.errors) {
                    const errorString = Object.values(data.errors).join('\n');
                    return { success: false, error: errorString };
                }
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};

export const putUser = async (user: User) => {
    const response = await axiosInstance.put(`/User/${user.userId}`, user);
    return response.data;
}

export const deleteUser = async (id: number) => {
    const response = await axiosInstance.delete(`/User/${id}`);
    return response.data;
}





