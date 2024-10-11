'use server';
import { axiosInstance } from "./httpConfig";
import axios from "axios";

export const getAllCertifications = async (options: GetAllCertificationsOptions = {}) => {
    const { page = 1, limit = 10, certificationId, studentId, type} = options

    const url = `/Certification?page=${page}&limit=${limit}${certificationId ? `&certId=${certificationId}` : ''}${studentId ? `&studentId=${studentId}` : ''}${type ? `&certType=${type}` : ''}`;

    try {
        const response = await axiosInstance.get(url);
        return response.data as Certification[];
    } catch (error) {
        throw new Error('Error fetching all certifications');    
    }
}

