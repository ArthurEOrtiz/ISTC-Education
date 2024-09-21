import { FaPlus, FaTimes } from "react-icons/fa";

interface UserListProps {
    users: User[];
    loading: boolean;
    onClick: (user: User) => void;
    add: boolean;
    nullText?: string;
}

const UserList: React.FC<UserListProps> = ({users, loading, onClick, add, nullText = "No Stundets"}) => {
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
                                className="btn btn-error btn-circle btn-sm dark:text-white"
                                onClick={() => onClick(user)}>
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
                <div className="flex justify-center">   
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}
        </>
    );
}

export default UserList;
