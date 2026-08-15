"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import GlassCard from "@/components/ui/GlassCard";
import LoginForm from "@/components/Auth/LoginForm";
import RegisterForm from "@/components/Auth/RegisterForm";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-deep/70 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <GlassCard className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-8">
              <button
                onClick={onClose}
                className="absolute left-4 top-4 text-cream/40 transition-colors hover:text-cream"
                aria-label="بستن"
              >
                <FiX size={20} />
              </button>

              <div className="flex mb-8 rounded-xl bg-cream/5 p-1">
                {(["login", "register"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200",
                      tab === t
                        ? "bg-gold text-deep shadow-sm"
                        : "text-cream/50 hover:text-cream",
                    )}
                  >
                    {t === "login" ? "ورود" : "ثبت‌نام"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: tab === "login" ? -12 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tab === "login" ? 12 : -12 }}
                  transition={{ duration: 0.18 }}
                >
                  {tab === "login" ? (
                    <LoginForm onSuccess={onClose} />
                  ) : (
                    <RegisterForm onGoToLogin={() => setTab("login")} />
                  )}
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
