"use client";

import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiSend, FiPaperclip, FiX } from "react-icons/fi";
import { useConversationDetail, useSendMessage } from "@/hooks/useConversation";
import { formatJalaliDateTime } from "@/lib/jalaali";
import { MEDIA_BASE_URL } from "@/lib/axios";

type Props = {
  conversationId?: string;
  role: "staff" | "member";
  title: string;
  /** آیا این پیام از طرف خود کاربر فعلی است؟ */
  isMine: (msg: any) => boolean;
  /** برچسب بالای حباب، مثلاً "شما" یا نام فرستنده */
  getSenderLabel?: (msg: any, mine: boolean) => string;
  placeholder?: string;
  emptyText?: string;
  onClose?: () => void;
  className?: string;
};

const fileUrl = (f: string) => (f.startsWith("http") ? f : `${MEDIA_BASE_URL}${f}`);

export default function ConversationChat({
  conversationId,
  role,
  title,
  isMine,
  getSenderLabel,
  placeholder = "پیام خود را بنویسید...",
  emptyText = "هنوز پیامی رد و بدل نشده است.",
  onClose,
  className = "",
}: Props) {
  const { data: conversation, isLoading } = useConversationDetail(conversationId, role);
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId || "");

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // فقط خود کانتینر چت اسکرول می‌شود، نه کل صفحه
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages, isLoading]);

  const handleSend = () => {
    if ((!text.trim() && !file) || !conversationId || isPending) return;
    sendMessage(
      { text, file },
      {
        onSuccess: () => {
          setText("");
          setFile(null);
        },
      },
    );
  };

  const messages = conversation?.messages ?? [];

  return (
    <div className={`flex flex-col h-[450px] ${className}`}>
      {/* هدر */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FiMessageSquare className="text-gold shrink-0" size={16} />
          <h3 className="text-sm font-semibold text-cream/90 truncate">{title}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
            aria-label="بستن چت"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* پیام‌ها */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {!conversationId ? (
          <div className="text-center py-8 text-cream/40 text-sm">
            برای این مورد هنوز گفتگویی ایجاد نشده است.
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-cream/40 text-sm">{emptyText}</div>
        ) : (
          messages.map((msg: any) => {
            const mine = isMine(msg);
            const msgText = msg.text || msg.media?.text;
            const msgFile = msg.file || msg.media?.file;
            const label = getSenderLabel ? getSenderLabel(msg, mine) : mine ? "" : msg.sender;

            return (
              <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    mine
                      ? "bg-gold text-deep rounded-br-none"
                      : "bg-cream/10 text-cream border border-white/5 rounded-bl-none"
                  }`}
                >
                  {label && (
                    <p className={`text-[10px] font-bold mb-1 ${mine ? "text-deep/60" : "text-gold"}`}>
                      {label}
                    </p>
                  )}
                  {msgText && <p className="text-sm whitespace-pre-wrap mb-2">{msgText}</p>}
                  {msgFile && (
                    <a
                      href={fileUrl(msgFile)}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1 text-xs mt-1 px-2 py-1 rounded transition-colors ${
                        mine ? "bg-deep/10 hover:bg-deep/20" : "bg-black/20 hover:bg-black/30"
                      }`}
                    >
                      <FiPaperclip size={12} />
                      فایل پیوست
                    </a>
                  )}
                  <p className={`text-[10px] mt-1.5 text-right ${mine ? "text-deep/60" : "text-cream/40"}`}>
                    {formatJalaliDateTime(new Date(msg.created_at))}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ارسال */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              rows={2}
              disabled={!conversationId}
              className="w-full rounded-xl border border-cream/10 bg-deep/50 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 resize-none transition-all disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            {file && (
              <div className="flex items-center gap-2 text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-lg w-fit border border-gold/20">
                <FiPaperclip size={12} />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => setFile(null)} className="hover:text-red-400 ml-1">
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="p-3 rounded-xl border border-cream/10 bg-cream/5 text-cream/60 hover:text-gold hover:border-gold/30 cursor-pointer transition-colors">
              <FiPaperclip size={18} />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <button
              onClick={handleSend}
              disabled={isPending || !conversationId || (!text.trim() && !file)}
              className="p-3 rounded-xl bg-gold text-deep hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-gold/10"
            >
              {isPending ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-deep/30 border-t-deep" />
              ) : (
                <FiSend size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}