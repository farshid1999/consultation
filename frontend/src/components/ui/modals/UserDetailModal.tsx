"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react"; // یا هر کتابخانه مودالی که دارید
import { FiX, FiMapPin, FiBriefcase, FiFileText } from "react-icons/fi";
import type { UserDetail } from "@/types";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail | null;
}

export default function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#0f1f12]/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-slate-200">

                {/* هدر مودال با گرادیان برند */}
                <div className="relative bg-gradient-to-r from-[#0f1f12] to-[#1e5c3f] px-6 py-5 flex items-center justify-between">
                  <div>
                    <Dialog.Title as="h3" className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#c9a24d]"></span>
                      پروفایل کاربری
                    </Dialog.Title>
                    <p className="text-xs text-white/70 mt-1">{user.username}</p>
                  </div>
                  <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                    <FiX size={20} />
                  </button>
                </div>

                {/* بدنه مودال */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                  {/* اطلاعات اصلی */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">نام و نام خانوادگی</label>
                        <p className="font-bold text-slate-800">{user.first_name} {user.last_name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">شماره تماس</label>
                        <p className="font-medium text-slate-700 dir-ltr text-left">{user.phone_number}</p>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">ایمیل</label>
                        <p className="font-medium text-slate-700">{user.email || "—"}</p>
                      </div>
                    </div>

                    {/* آدرس */}
                    {user.address && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-[#0f1f12] mb-3 flex items-center gap-2">
                          <FiMapPin className="text-[#c9a24d]" /> آدرس سکونت
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {user.address.province}، {user.address.city}
                          <br />
                          {user.address.street}
                        </p>
                        {user.address.postal_code && (
                          <p className="text-xs text-slate-400 mt-2">کد پستی: {user.address.postal_code}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* باشگاه */}
                  {user.club && (
                    <div className="mb-8 bg-[#e8f5ee]/30 p-4 rounded-xl border border-[#bfe3cf]">
                      <h4 className="text-sm font-bold text-[#1e5c3f] mb-2 flex items-center gap-2">
                        <FiBriefcase /> باشگاه مرتبط
                      </h4>
                      <p className="font-bold text-slate-800">{user.club.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {user.club.address.city}، {user.club.address.province}
                      </p>
                    </div>
                  )}

                  {/* اطلاعات تکمیلی (درختی) */}
                  {user.informations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">اطلاعات تکمیلی</h4>
                      <div className="space-y-3">
                        {user.informations.map((info) => (
                          <InformationNode key={info.id} info={info} />
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* فوتر مودال */}
                <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
                  <button
                    onClick={onClose}
                    className="rounded-xl bg-white border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:border-[#c9a24d] hover:text-[#c9a24d] transition-all"
                  >
                    بستن
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// کامپوننت بازگشتی برای نمایش اطلاعات درختی داخل مودال
function InformationNode({ info, depth = 0 }: { info: any; depth?: number }) {
  return (
    <div className={depth > 0 ? "mr-4 border-r-2 border-[#c9a24d]/20 pr-3" : ""}>
      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
        <p className="text-sm font-bold text-slate-700">{info.title}</p>
        {info.text && <p className="text-xs text-slate-500 mt-1">{info.text}</p>}
        {info.file && (
          <a href={info.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[#c9a24d] mt-2 hover:underline">
            <FiFileText size={12} /> مشاهده فایل
          </a>
        )}
      </div>
      {info.children?.length > 0 && (
        <div className="mt-2 space-y-2">
          {info.children.map((child: any) => (
            <InformationNode key={child.id} info={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}