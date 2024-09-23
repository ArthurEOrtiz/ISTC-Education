import { FaTimes } from "react-icons/fa";

interface ModalBaseProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    width?: string;
    height?: string;
    onClose: () => void;
}

const ModalBase: React.FC<ModalBaseProps> = ({ title, children, isOpen, width = "w-96", height = "", onClose }) => {
    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="fixed inset-0 flex justify-center items-center">
                <div className={`bg-gray-500 border rounded-lg shadow-lg max-h-svh overflow-y-auto ${width} ${height}`}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-white text-3xl font-bold">{title}</h2>
                        <button 
                            onClick={onClose}
                            className="btn btn-error btn-circle btn-sm text-white font-extrabold"
                        ><FaTimes /></button>
                    </div>
                    <div className="p-4 text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalBase;