'use server';
import { axiosInstance } from "./httpConfig";
import axios from "axios";

export const getAttendanceRecords = async (email: string) => {
    try {
        const response = await axiosInstance.get(`Student/Attendance/${email}`);
        return response.data as Student;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching attendance records');
        }
    }
}

export const isStudenEnrolled = async (courseId: number, studentId: number): Promise<boolean> => {
    try {
        const response = await axiosInstance.get(`/Student/IsStudentEnrolled/${courseId}${studentId}`);
        return response.status === 200;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return false;
        } else {
            throw new Error('Error fetching enrollment status');
        }
    }
}

export const addWaitQueue = async (courseId: number, studentId: number): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post(`/Student/AddWaitQueue/${courseId}/${studentId}`);
        if (response.status === 204) {
            return { success: true };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if(error.response?.status === 400) {
                const errors: ErrorResponse | string = error.response.data.errors ?? error.response.data;
                console.log(errors);
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

export const removeWaitQueue = async (courseId: number, studentId: number): Promise<ApiResponse> => {
    console.log("removeWaitQueue", courseId, studentId);
    try {
        const response = await axiosInstance.delete(`/Student/RemoveWaitQueue/${courseId}/${studentId}`);
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

