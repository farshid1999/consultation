"use client";

import { useState } from "react";
import { useAdminContacts, useMarkAsRead } from "@/hooks/useContact";
import { FiMail, FiPhone, FiMessageSquare, FiCheck } from "react-icons/fi";
import { cn } from "@/lib/utils";
import type { ContactRequest } from "@/types/ContactRequest";

const contactTypeLabel = {
  phone: "تماس تلفنی",
  messenger: "پیام‌رسان",
  email: "ایمیل",
};

const messengerLabel = {
  whatsapp: "واتساپ",
  telegram: "تلگرام",
  eitaa: "ایتا",
  rubika: "روبیکا",
  bale: "بله",
};

const contactTypeIcon = {
  phone: <FiPhone size={14} />,
  messenger: <FiMessageSquare size={14} />,
  email: <FiMail size={14} />,
};

export default function AdminContactsPage() {
  const { data, isLoading } = useAdminContacts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-cream">درخواست‌های ارتباط</h1>
        <p className="text-cream/40 text-sm mt-1">لیست درخواست‌های مشاوره کاربران</p>
      </div>

      {isLoading ? (
        <p className="text-cream/30 text-sm">در حال بارگذاری...</p>
      ) : data?.results?.length === 0 ? (
        <p className="text-cream/30 text-sm">درخواستی یافت نشد</p>
      ) : (
        <div className="space-y-3">
          {data?.results?.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContactCard({ contact }: { contact: ContactRequest }) {
  const { mutate: markAsRead, isPending } = useMarkAsRead(contact.id);

  return (
    <div className={cn(
      "p-5 rounded-2xl border transition-colors",
      contact.is_read
        ? "border-cream/10 bg-cream/5"
        : "border-gold/20 bg-gold/5"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {!contact.is_read && (
              <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
            )}
            <p className="text-sm font-semibold text-cream">
              {contact.first_name} {contact.last_name}
            </p>
          </div>
          <p className="text-xs text-cream/50" dir="ltr">{contact.phone}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs",
            "border border-cream/10 text-cream/50"
          )}>
            {contactTypeIcon[contact.contact_type]}
            {contactTypeLabel[contact.contact_type]}
            {contact.contact_type === "messenger" && contact.messenger_type && (
              <span>({messengerLabel[contact.messenger_type]})</span>
            )}
          </span>

          {!contact.is_read && (
            <button
              onClick={() => markAsRead()}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border border-green-400/30 text-green-400 hover:bg-green-400/10 transition-colors disabled:opacity-50"
            >
              <FiCheck size={12} />
              خوانده شد
            </button>
          )}
        </div>
      </div>

      {contact.email && (
        <p className="mt-2 text-xs text-cream/40" dir="ltr">{contact.email}</p>
      )}

      {contact.message && (
        <p className="mt-3 text-sm text-cream/60 border-t border-cream/10 pt-3">
          {contact.message}
        </p>
      )}

      <p className="mt-2 text-xs text-cream/30">
        {new Date(contact.created_at).toLocaleDateString("fa-IR")}
      </p>
    </div>
  );
}