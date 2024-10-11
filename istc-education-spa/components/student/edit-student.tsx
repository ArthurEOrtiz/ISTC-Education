import React from 'react';

interface EditStudentProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>; 
    isAdmin?: boolean;
}

const EditStudent: React.FC<EditStudentProps> = ({ user, setUser, isAdmin }) => {


   
    return (
        <>
    

        </>
    );

}

export default EditStudent;