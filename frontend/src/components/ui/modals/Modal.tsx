"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // بستن مودال با دکمه Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* پس‌زمینه تیره و بلور */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* بدنه مودال */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-deep border border-cream/10 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">

        {/* هدر مودال */}
        {title && (
          <div className="flex items-center justify-between border-b border-cream/10 bg-gradient-to-r from-gold/5 to-transparent px-6 py-4">
            <h3 className="text-lg font-bold text-gold">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-cream/40 hover:bg-cream/10 hover:text-cream transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* محتوای مودال */}
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}