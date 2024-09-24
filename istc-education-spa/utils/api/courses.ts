'use server';
import { Course } from "@/types/models/course";
import { axiosInstance } from "./httpConfig";
import axios from "axios";
import { GetAllCoursesOptions } from "@/types/api/get-all-courses-options";

export const getAllCourses = async (options: GetAllCoursesOptions = {}) => {
    const { page = 1, limit = 10, statuses, startDate, endDate, search, courseIds} = options
    const startDateOnlystring =  startDate?.toISOString().split('T')[0];
    const endDateOnlystring = endDate?.toISOString().split('T')[0];
    
    let url = `/Course?page=${page}&limit=${limit}${startDate ? `&startDate=${startDateOnlystring}` : ''}${endDate ? `&endDate=${endDateOnlystring}` : ''}${search ? `&search=${search}` : ''}`;

    const effectiveStatuses = Array.isArray(statuses) ? statuses : ["Upcoming", "InProgress"];

    for (const status of effectiveStatuses) {
        url += `&status=${status}`;
    }

    if (courseIds) {
        for (const courseId of courseIds) {
            url += `&courseId=${courseId}`;
        }
    }

    console.log("URL: ", url);
    
    try {
        const response = await axiosInstance.get(url);
        return response.data as Course[];
    } catch (error) {
        throw new Error('Error fetching all courses');    
    }
}

export const getCourse = async (id: number): Promise<Course | null> => {
    try {
        const response = await axiosInstance.get(`/Course/${id}`);
        return response.data as Course;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        } else {
            throw new Error('Error fetching course by id');
        }
    }
}

export const postCourse = async (course: Course): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.post('/Course', course);
        if (response.status === 201) {
            return { success: true, data: response.data };
        } else {
            return { success: false, error: `Unexpected status code: ${response.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if(error.response?.status === 400) {
                console.log(error.response);
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

export const putCourse = async (course: Course): Promise<ApiResponse> => {
    try {
        const response = await axiosInstance.put(`/Course/${course.courseId}`, course);
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

export const getCourseEnrollments = async (courseId: number): Promise<[]> => {
    try {
        const response = await axiosInstance.get(`/Course/Enrollment/${courseId}`);
        return response.data as [];
    } catch (error) {
        throw new Error('Error fetching course enrollments');
    }
}

export const getCourseWaitlist = async (courseId: number): Promise<[]> => {
    try {
        const response = await axiosInstance.get(`/Course/WaitList/${courseId}`);
        return response.data as [];
    } catch (error) {
        throw new Error('Error fetching course wait list');
    }
}

export const deleteCourse = async (id: number): Promise<boolean> => {
    try {
        const response = await axiosInstance.delete(`/Course/${id}`);
        if (response.status === 204) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error('Error deleting course');
    }
}