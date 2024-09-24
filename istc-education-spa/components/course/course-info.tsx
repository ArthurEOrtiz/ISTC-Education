'use client';   
import { Course } from "@/types/models/course";
import { convertDateToMMDDYYYY } from "@/utils/global-functions";
import { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface CourseInfoProps {
    course: Course;
    expanded?: boolean;
}

const CourseInfo: React.FC<CourseInfoProps> = ({ course, expanded = false }) => {
    const [ isExpanded, setIsExpanded ] = useState<boolean>(expanded);
    const { 
        title, 
        description,
        enrollmentDeadline,
        attendanceCredit, 
        maxAttendance, 
        instructorName, 
        instructorEmail,
        hasExam,
        examCredit, 
        hasPDF,
        location,
        pdf,
    } = course as Course;

    const {
        description: locationDescription,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
    } = location as Location;

    const { fileName, data } = pdf ? pdf : { fileName: "", data: "" };

    const deadLine: string = convertDateToMMDDYYYY(enrollmentDeadline);

    return (
        <div className="p-4 w-full max-w-3xl">
            <div className="flex justify-between items-center gap-2">
                <h2 className="text-2xl font-bold">{title}</h2>
                <button 
                    className="btn btn-ghost btn-circle text-3xl"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <FaAngleUp/> : <FaAngleDown/>}
                </button>
            </div>
            
            <div className={`space-y-2 ${isExpanded ? "block" : "hidden"}`}>
                <div className="border-b p-2" />
                <p >{description}</p>
                <div className="flex gap-2">
                    <p className="font-bold">Enrollment Deadline:</p>
                    <p>{deadLine}</p>
                </div>
                <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        <p  className="font-bold">Attendance Credit:</p>
                        <p>{attendanceCredit}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="font-bold">Max Attendance:</p>
                        <p>{maxAttendance}</p>
                    </div>
                </div>
                {hasExam && (
                    <div className="flex justify-between gap-2">
                        <p className="text-lg text-error font-bold">Has Exam</p>
                        <div className="flex gap-2">
                            <p className="text-lg font-bold">Exam Credit:</p>
                            <p className="text-lg">{examCredit}</p>
                        </div>
                    </div>
                )}

                <div className="border-b" />
                <p className="text-xl font-bold">Instructor</p>

                <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        <p className="font-bold">Name:</p>
                        <p >{instructorName}</p>
                    </div>

                    {instructorEmail && (
                        <div className="flex gap-2">
                            <p className="font-bold">Email:</p>
                            <p>{instructorEmail}</p>
                        </div>
                    )}
                </div>

                <div className="border-b" />
                
                <p className="text-xl font-bold">Location</p>
                <p>{locationDescription}</p>

                <div>
                    <p>{addressLine1}</p>
                    <p>{addressLine2}</p>
                    <p>{city} {state} {postalCode}</p>
                </div>

                {hasPDF && (
                    <>
                        <div className="border-b" />
                        <p className="text-xl font-bold">PDF</p>
                        <a href={`data:application/pdf;base64,${data}`} download={fileName} className="text-lg text-info">{fileName}</a>
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseInfo;