import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    onAction: () => void;
    actionLabel: string;
}

const Modal: React.FC<ModalProps> = ({
    title,
    children,
    isOpen,
    onClose,
    onAction,
    actionLabel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed left-0 top-0 z-[80] flex h-full w-full items-center justify-center bg-[#13131a] bg-opacity-90">
            <div className="relative w-11/12 rounded-xl border shadow-sm md:w-1/2 lg:w-1/3 bg-card">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h2 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">
                            {title}
                        </h2>
                    </div>

                    <div className="mt-5">{children}</div>

                    <div className="mt-4 flex justify-end space-x-2">
                        <Button
                            onClick={onAction}
                            className="w-full"
                        >
                            {actionLabel}
                        </Button>
                    </div>
                </div>
                <Button
                    onClick={onClose}
                    className="absolute size-6 right-4 top-4 bg-transparent"
                    variant={"outline"}
                    size={"icon"}
                >
                    <X />
                </Button>
            </div>
        </div>
    );
};

export default Modal;
