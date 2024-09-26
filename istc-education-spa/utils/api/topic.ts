'use server';
import { Topic } from "@/types/models/topic";
import { axiosInstance } from "./httpConfig";
import axios from "axios";

export const getAllTopics = async (page:number = 1, limit:number = 10, search?:string | null) => {
    const url = `/Topic?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
    console.log("getAllTopics URL:", url);
    try {
        const response = await axiosInstance.get(url);
        return response.data as Topic[];
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching all topics');
    }
}

export const getTopic = async (id: number): Promise<Topic | null> => {
    try {
        const response = await axiosInstance.get(`/Topic/${id}`);
        return response.data as Topic;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching topic by id');
        }
    }
}

export const postTopic = async (topic: Topic): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post('/Topic', topic);
        if (response.status === 201) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const errors = error.response.data.errors as ErrorResponse;
                if (errors) {
                    return { success: false, error: errors };
                } else {
                    return { success: false, error: `Unexpected status code: ${error.status}` };
                }
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}

export const putTopic = async (topic: Topic): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.put(`/Topic/${topic.topicId}`, topic);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}

export const deleteTopic = async (id: number): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.delete(`/Topic/${id}`);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}
