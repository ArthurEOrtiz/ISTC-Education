interface UserInfoProps {
    user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="space-y-2">
            <div className="border-b border-info">
                <h2 className="text-2xl font-bold">{user.firstName} {user.middleName} {user.lastName}</h2>
            </div>
            {user.contact && (
                <>
                    <div className="flex justify-between">
                        <div>
                            <span className="font-bold">Email:</span> {user.contact.email}
                        </div>
                        {user.contact.phone && (
                            <div>
                                <span className="font-bold">Phone:</span> {user.contact.phone}
                            </div>
                        )}
                    </div>
                    {user.contact.addressLine1 && (
                        <div>
                            <span className="font-bold">Address Line 1:</span> {user.contact.addressLine1}
                            
                        </div>
                    )}
                    {user.contact.addressLine2 && (
                            <div>
                                <span className="font-bold">Address Line 2:</span> {user.contact.addressLine2}  
                            </div>
                    )}
                    <div className="flex justify-between">
                        {user.contact.city && (
                            <div>
                                <span className="font-bold">City:</span> {user.contact.city}
                            </div>
                        )}
                        {user.contact.state && (
                            <div>
                                <span className="font-bold">State:</span> {user.contact.state}
                            </div>
                        )}
                        {user.contact.postalCode && (
                            <div>
                                <span className="font-bold">Zip:</span> {user.contact.postalCode}
                            </div>
                        )}
                    </div>
                </>
            )}
            {user.employer && (
                <div className="flex justify-between">
                    <div>
                        <span className="font-bold">Employer:</span> {user.employer.employerName}
                    </div>
                    <div>
                        <span className="font-bold">Title:</span> {user.employer.jobTitle}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserInfo;