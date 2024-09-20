'use server';
import { axiosInstance } from "./httpConfig";
import axios from "axios";
import { clerkClient } from "@clerk/nextjs/server";

export const getAllUsers = async (page:number, limit:number, search?:string ) => {
    try {
        const url = search ? `/User?page=${page}&limit=${limit}&search=${search}` : `/User?page=${page}&limit=${limit}`;
        const response = await axiosInstance.get(url);
        return response.data as User[];
    } catch (error) {
        throw new Error('Error fetching all users');    
    }
}

export const getUser = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/User/${id}`);
        return response.data as User;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching user by id');
        }
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const response = await axiosInstance.get(`/User/Email/${email}`);
        return response.data as User;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching user by email');
        }
    }
}

export const getUserByIPId = async (IPId: string): Promise<User | null> => {
    try {
        const response = await axiosInstance.get(`/User/IPId/${IPId}`);
        return response.data as User;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching user by IPId');
        }
    }
};

export const getUserByStudentId = async (studentId: number): Promise<User | null> => {
    try {
        const response = await axiosInstance.get(`/User/StudentId/${studentId}`);
        return response.data as User;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching user by studentId');
        }
    }
}

export const postUser = async (user: User): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post('/User', user);
        if (response.status === 201) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const errors: ErrorResponse | string = error.response.data.errors ?? error.response.data;
                if (errors) {
                    return { success: false, error: errors };
                } else {
                    return { success: false, error: `Unexpected error code: ${error.status}` };
                } 
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
};

export const putUser = async (user: User): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.put(`/User/${user.userId}`, user);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const errors: ErrorResponse | string = error.response.data.errors ?? error.response.data;
                if (errors) {
                    return { success: false, error: errors}
                } else {
                    return { success: false, error: `Unexpected error code: ${error.status}` };
                }
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        const response = await axiosInstance.delete(`/User/${id}`);
        if (response.status === 204) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error('Error deleting user');
    }
}

export const isUserAdmin = async (IPId: string ): Promise<boolean> => {
    try {
        const user = await clerkClient().users.getUser(IPId);

        const { privateMetadata }: { privateMetadata: UserPrivateMetadata } = user;

        return privateMetadata.isAdmin === true;
    } catch (error) {
        throw new Error('Error checking if user is admin');
    }
}









