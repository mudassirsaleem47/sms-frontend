import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
    const [isClosing, setIsClosing] = useState(false);

    // Reset closing state when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 100); // Match animation duration
    };

    const handleConfirm = () => {
        setIsClosing(true);
        setTimeout(() => {
            onConfirm();
            onClose();
        }, 100); // Match animation duration
    };

    return (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden ${isClosing ? 'animate-scale-down' : 'animate-scale-up'}`}>
                
                {/* Header */}
                <div className="p-6 flex flex-row justify-center items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-full shrink-0">
                        <AlertTriangle className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{message}</p>
                    </div>
                    <button 
                        onClick={handleClose} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 flex justify-end gap-3">
                    <button 
                        onClick={handleClose} 
                        className="px-5 w-1/2 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition shadow-sm"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className="px-5 py-2.5 bg-red-600 w-1/2 text-white rounded-lg hover:bg-red-700 font-medium transition shadow-lg hover:shadow-xl"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
