'use server';
import { Course } from "@/types/models/course";
import { axiosInstance } from "./httpConfig";
import axios from "axios";
import { GetStudentEnrollmentOptions } from "@/types/api/get-stundent-enrollment-options";

export const getStudents = async (options: GetStudentsOptions = {}): Promise<Student | Student [] | null> => {
    const { page = 1, limit = 10, studentId, email } = options;
    const url = `Student?page=${page}&limit=${limit}${studentId ? `&studentId=${studentId}` : ''}${email ? `&email=${email}` : ''}`;

    try {
        const response = await axiosInstance.get(url);
        const data = response.data;
        if (Array.isArray(data)) {
            if (data.length === 0) {
                return null;
            }

            if (data.length === 1) {
                return data[0] as Student;
            }

            return data as Student[];
        } else {
            return data as Student;
        }
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

export const getStudentEnrollment = async (options:GetStudentEnrollmentOptions = {}): Promise<Course[]> => {
    const { page = 1, limit = 10, search, statuses, studentId } = options;

    if (!studentId) {
        throw new Error('Student ID is required');
    }

    let url = `Student/Enrollment/${studentId}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;

    const effectiveStatuses = Array.isArray(statuses) ? statuses : ["Upcoming", "InProgress"];

    for (const status of effectiveStatuses) {
        url += `&status=${status}`;
    }

    try {
        const response = await axiosInstance.get(url);
        return response.data as Course[];
    } catch (error) {
        throw new Error('Error fetching student enrollment');
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

export const enrollStudents = async (courseId: number, studentIds: number[]): Promise<ApiResponse> => {
    const url = `/Student/Enroll/${courseId}?${studentIds.map(id => `studentIds=${id}`).join('&')}`;

    try {
        const response = await axiosInstance.post(url);
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

// Not implemented
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