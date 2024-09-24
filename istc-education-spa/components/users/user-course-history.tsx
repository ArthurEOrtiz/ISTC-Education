import { useState } from "react";

interface UserCourseHistoryProps {
    user: User;
}

const UserCourseHistory: React.FC<UserCourseHistoryProps> = ({ user }) => {
    const [ upcomingCourses, setUpcomingCourses ] = useState<Course[]>([]);
    const [ completedCourses, setCompletedCourses ] = useState<Course[]>([]);
    const [ waitlistedCourses, setWaitlistedCourses ] = useState<Course[]>([]);


    return (
        <>
            
        </>
    )
}

export default UserCourseHistory;