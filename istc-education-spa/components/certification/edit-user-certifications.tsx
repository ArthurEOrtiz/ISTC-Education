import { Dispatch, SetStateAction, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import ModalBase from "../modal/modal-base";

interface EditUserCertificationsProps {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
}

export const EditUserCertifications: React.FC<EditUserCertificationsProps> = ({ user, setUser }) => {
    const { student } = user;
    const { certifications } = student!;
    const [ confirmRemoveModal, setConfirmRemoveModal ] = useState<boolean>(false);
    const [ selectedModalIndex, setSelectedModalIndex ] = useState<number>(0);  

    const handleOpenRemoveModal = (index: number) => {
        setConfirmRemoveModal(true);
        setSelectedModalIndex(index);
    }

    const handleRemoveCertification = (index: number) => {
        setConfirmRemoveModal(false);
        setUser({
            ...user,
            student: {
                ...student!,
                certifications: certifications!.filter((cert, i) => i !== index)
            }
        });
    }

    const handleAddCertification = (type: 'Appraiser' | 'Mapping') => {
        setUser({
            ...user,
            student: {
                ...student!,
                certifications: [
                    ...certifications!,
                    { 
                        certificationId: 0,
                        studentId: student!.studentId,
                        type,
                        requestedDate: new Date(), 
                        reviewDate: null,
                        isApproved: false,
                        approvedBy: null
                    }
                ]
            }
        });
    }

    const handleApproveCertification = (index: number) => {
        setUser({
            ...user,
            student: {
                ...student!,
                certifications: certifications!.map((cert, i) => {
                    if (i === index) {
                        return {
                            ...cert,
                            isApproved: true,
                            approvedBy: user.userId,
                            reviewDate: new Date()  
                        }
                    }
                    return cert;
                })
            }
        });
    }

    const handleDenyCertification = (index: number) => {
        setUser({
            ...user,
            student: {
                ...student!,
                certifications: certifications!.map((cert, i) => {
                    if (i === index) {
                        return {
                            ...cert,
                            isApproved: false,
                            approvedBy: user.userId,
                            reviewDate: new Date()
                        }
                    }
                    return cert;
                })
            }
        });
    }

    return (
        <>
            <div className="w-full space-y-2">
            {certifications!.length === 0 ? (
                <div className="bg-error-content p-4 rounded-md">
                    <p className="text-error font-bold">This student has no certifications</p>
                    </div>
                ) : (
                    certifications!.map((certification, index) => (
                        <div key={index} className="bg-info p-2 rounded-md relative">
                            <button
                                className="btn btn-error btn-xs btn-circle text-white absolute top-2 right-2"
                                onClick={() => { handleOpenRemoveModal(index) }}
                            >
                                <FaTimes />
                            </button>
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <p>{certification.type}</p>
                                    <p>Requested: {new Date(certification.requestedDate).toLocaleDateString('en-US')}</p>
                                    <p>Status: {certification.approvedBy == null ? "Pending" : certification.isApproved ? "Approved" : "Denied"}</p>
                                </div>
                                <div className="flex justify-start mt-2">
                                    <button
                                        className="btn btn-success btn-xs mr-2"
                                        onClick={() => { handleApproveCertification(index) }}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-warning btn-xs"
                                        onClick={() => { handleDenyCertification(index) }}
                                    >
                                        Deny
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
             
                )}
                <div className="flex justify-end gap-2">
                    <button
                        className="btn btn-sm btn-success text-white"
                        disabled={certifications!.some(cert => cert.type === "Mapping")}
                        onClick={() => handleAddCertification("Mapping")}
                        >
                            <FaPlus /> Mapping Certification
                    </button>
                    <button
                        className="btn btn-sm btn-success text-white"
                        disabled={certifications!.some(cert => cert.type === "Appraiser")}
                        onClick={() => handleAddCertification("Appraiser")}
                        >
                            <FaPlus /> Appraiser Certification
                    </button>
                </div>
            </div>
            <ModalBase
                title="Remove Certification"
                isOpen={confirmRemoveModal}
                onClose={() => setConfirmRemoveModal(false)}
                width="w-1/2"
            >
                <div className="space-y-2">
                    <p>Are you sure you want to remove this certification?</p>
                    <p className="font-bold text-error">This action cannot be undone!</p>  
                    <div className="flex justify-end gap-2">
                        <button
                            className="btn btn-success text-white"
                            onClick={() => setConfirmRemoveModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-error text-white"
                            onClick={() => handleRemoveCertification(selectedModalIndex)}
                        >
                            Remove Certification
                        </button>
                    </div>
                </div>
            </ModalBase>
        </>
    );
};


export default EditUserCertifications;