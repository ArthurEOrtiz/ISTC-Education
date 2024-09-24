'use server';
import { axiosInstance } from "./httpConfig";
import axios from "axios";

interface GetStudentsOptions {
    page?: number;
    limit?: number;
    studentId?: number;
    email?: string;
}

export const getStudents = async (options: GetStudentsOptions = {}): Promise<Student | Student [] | null> => {
    const { page = 1, limit = 10, studentId, email } = options;
    const url = `Student?page=${page}&limit=${limit}${studentId ? `&studentId=${studentId}` : ''}${email ? `&email=${email}` : ''}`;
    try {
        const response = await axiosInstance.get(url);
        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
        } else {
            throw new Error('Error fetching students');
        }
    }
}

export const isStudenEnrolled = async (courseId: number, studentId: number): Promise<boolean> => {
    try {
        const response = await axiosInstance.get(`/Student/IsStudentEnrolled/${courseId}/${studentId}`);
        return response.data as boolean;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        } else {
            throw new Error('Error fetching enrollment status');
        }
    }
}

export const addWaitlist = async (courseId: number, studentId: number): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post(`/Student/AddWaitlist/${courseId}/${studentId}`);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if(error.response?.status === 400) {
                const errors: ErrorResponse | string = error.response.data.errors ?? error.response.data;
                if (errors) {
                    return { success: false, error: errors};
                } else {
                    return { success:false, error: `Unexpected status code: ${error.status}`};
                }
            }
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}

export const removeWaitlist = async (courseId: number, studentId: number): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.delete(`/Student/RemoveWaitlist/${courseId}/${studentId}`);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errors: ErrorResponse | string = error.response?.data.errors ?? error.response?.data === "" ? error.message : error.response?.data;
            return { success: false, error: errors};
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}

export const enrollStudent = async (courseId: number, studentId: number): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post(`/Student/Enroll/${courseId}/${studentId}`);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errors: ErrorResponse | string = error.response?.data.errors ?? error.response?.data === "" ? error.message : error.response?.data;
            return { success: false, error: errors};
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}

export const dropStudent = async (courseId: number, studentId: number): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.delete(`/Student/Drop/${courseId}/${studentId}`);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errors: ErrorResponse | string = error.response?.data.errors ?? error.response?.data === "" ? error.message : error.response?.data;
            return { success: false, error: errors};
        }
        return { success: false, error: 'An unexpected error ocurred' };
    }
}