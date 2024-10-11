'use client';
import React, { useEffect, useState } from "react";
import ModalBase from "../modal/modal-base";
import { getAllCertifications } from "@/utils/api/certification";

interface CertificationButtonProps {
    studentId: number;
}

const CertificationButton: React.FC<CertificationButtonProps> = ({studentId}) => {
    const [ certModal, setCertModal ] = useState(false);
    const [ certifications, setCertifications ] = useState<Certification[]>([]);
    const [ loadingCerts, setLoadingCerts ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);  

    useEffect(() => {
        setLoadingCerts(true);
        getAllCertifications({studentId}).then((certs) => {
            setCertifications(certs);
        }).catch((error) => {
            setError(error.message);
        }).finally(() => {
            setLoadingCerts(false);
        });
    }, []);

    return (
        <>
            <button
                className="btn btn-info btn-sm"
                onClick={() => setCertModal(true)}>
                Certification
            </button>
            <ModalBase 
                title="Certification"
                isOpen={certModal}
                onClose={() => setCertModal(false)}
                width="w-full max-w-xl"
            >
                {error && <p>{error}</p>}
                {loadingCerts && <p>Loading Certifications...</p>}
                {!loadingCerts && !error && (
                    <div className="space-y-2">
                        {certifications.map((cert, index) => (
                            <div key={index} className="border border-info rounded-md p-4">
                                <h2 className="text-xl font-bold">{cert.type}</h2>
                                <p>Requested: {new Date(cert.requestedDate).toLocaleDateString('en-US')}</p>
                                <p>Status: {cert.reviewDate == null ? "Pending" : cert.isApproved ? "Approved" : "Deneied"}</p>
                               

                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        className="btn btn-info btn-sm"
                        disabled={certifications.some(cert => cert.type === 'Mapping')}
                    >
                        Apply for Mapping Certification
                    </button>
                    <button
                        className="btn btn-info btn-sm"
                        disabled={certifications.some(cert => cert.type === 'Appraiser')}
                    >
                        Apply for Appraiser Certification
                    </button>
                </div>

                
            </ModalBase>
        </>


    );
}

export default CertificationButton;