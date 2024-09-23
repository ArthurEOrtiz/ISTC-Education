'use server';
import { axiosInstance } from "./httpConfig";
import axios from "axios";

export const getAttendance = async (classId?: number): Promise<Attendance[]> => {
    const url = classId ? `/Attendance?classId=${classId}` : '/Attendance';
    try {
        const response = await axiosInstance.get(url);
        return response.data as Attendance[];
    } catch (error) {
        throw new Error('Error fetching attendance');
    }
}

export const updateAttendance = async (attendances: Attendance | Attendance[]): Promise<ApiResponse> => {
    console.log("sending data", attendances);
    
    try {
        const response = await axiosInstance.put('/Attendance', attendances);
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