import { FaPlus, FaTimes } from "react-icons/fa";

interface UserListProps {
    users: User[];
    enrollments: User[];
    loading: boolean;
    onClick: (user: User) => void;
    add: boolean;
    nullText?: string;
}

const UserList: React.FC<UserListProps> = ({users, enrollments, loading, onClick, add, nullText = "No Stundets"}) => {
    const isUserEnrolled = (user: User): boolean => {
        return enrollments.some(e  => e.userId === user.userId);
    }

    const isButtonDisabled = (user: User): boolean => {
        if (!add) {
            return false;
        }
        return isUserEnrolled(user);
    }
    
    return (
        <>
            {!loading && users.length > 0 ? (
                users.map((user, index) => (
                    <div key={index} className="border border-info rounded-md flex justify-between items-center p-4">
                        <div className="flex gap-2">
                            <p className="font-bold">{user.lastName}, {user.firstName} {user.middleName}</p>
                            <p>{user.contact.email}</p>
                        </div>
                        <div>
                            <button 
                                className={`btn btn-circle btn-sm dark:text-white ${add ? "btn-success" : "btn-error"}`}
                                onClick={() => onClick(user)}
                                disabled={isButtonDisabled(user)}>
                                    {add ? <FaPlus /> : <FaTimes />}
                        </button>
                        </div>
                    </div>
                )
            )
            ) : !loading && users.length === 0 ? (
                <div className="bg-error-content p-4 rounded-md">
                    <p className="text-error">{nullText}</p>
                </div>
            ) : (
                <div className="border border-info rounded-md flex justify-center p-4">   
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
        </>
    );
}

export default UserList;
