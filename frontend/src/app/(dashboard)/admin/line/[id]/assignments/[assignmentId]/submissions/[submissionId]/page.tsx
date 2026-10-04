"use client";

import { useParams, useRouter } from "next/navigation";
import { useStaffSubmissionDetail } from "@/hooks/useAssignment";
import { useConversationDetail, useSendMessage } from "@/hooks/useConversation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiClock,
  FiDownload,
  FiMessageSquare,
  FiSend,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
import { formatJalaliDateTime } from "@/lib/jalaali";
import { MEDIA_BASE_URL } from "@/lib/axios";

export default function StaffSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();

  // توجه: نام پوشه اول [id] است، پس lineId در params.id قرار دارد
  const lineId = params.id as string;
  const assignmentId = params.assignmentId as string;
  const submissionId = params.submissionId as string;

  // ۱. دریافت جزئیات سابمیشن
  const { data: submission, isLoading: loadingSubmission } =
    useStaffSubmissionDetail(lineId, assignmentId, submissionId);
  console.log("submission:", submission);

  const conversationId = submission?.conversation;

  // ۲. دریافت پیام‌های کانورسیشن
  const { data: conversation, isLoading: loadingMessages } =
    useConversationDetail(conversationId, "staff");
  console.log("🔍 DEBUG Full Conversation Object:", conversation);

  // ۳. هوک ارسال پیام
  const { mutate: sendMessage, isPending: sendingMessage } = useSendMessage(
    conversationId || "",
  );

  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسکرول خودکار به پایین هنگام دریافت پیام جدید
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, loadingMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedFile) return;
    if (!conversationId) return;

    sendMessage(
      { text: newMessage, file: selectedFile },
      {
        onSuccess: () => {
          setNewMessage("");
          setSelectedFile(null);
        },
      },
    );
  };

  if (loadingSubmission) {
    return (
      <div className="flex items-center justify-center py-32 text-cream/30 text-sm">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-cream/30 text-sm">
          پاسخی یافت نشد یا دسترسی ندارید.
        </p>
        <button
          onClick={() => router.back()}
          className="text-gold text-sm hover:underline"
        >
          بازگشت به لیست
        </button>
      </div>
    );
  }

  // تشخیص اینکه آیا پیام از طرف کارمند (من) بوده یا عضو
  const isMyMessage = (senderName: string) => {
    return senderName !== submission.member;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors"
        >
          <FiArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-cream">بررسی پاسخ تکلیف</h1>
          <p className="text-cream/50 text-sm mt-1">{submission.assignment}</p>
        </div>
      </div>

      {/* کانتینر اصلی یکپارچه */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden flex flex-col max-h-[85vh]">
        {/* بخش ۱: اطلاعات عضو و محتوای ارسالی (Scrollable) */}
        <div className="p-6 md:p-8 border-b border-white/5 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold text-lg font-bold border border-gold/20">
                {submission.member?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-cream font-semibold">
                  {submission.member}
                </h3>
                <p className="text-cream/40 text-xs mt-1">پاسخ‌دهنده</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-cream/40 text-xs bg-cream/5 px-3 py-1.5 rounded-lg border border-white/5">
              <FiClock size={14} />
              <span>
                {formatJalaliDateTime(new Date(submission.created_at))}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gold flex items-center gap-2 mb-2">
              <FiMessageSquare size={16} />
              محتوای ارسالی عضو
            </h3>

            {submission.media_items.length === 0 ? (
              <p className="text-cream/40 text-sm italic bg-cream/5 p-4 rounded-xl border border-white/5">
                عضو هیچ متنی ارسال نکرده است.
              </p>
            ) : (
              <div className="space-y-4">
                {submission.media_items.map((item) => {
                  // ✅ استخراج و کوتاه‌سازی نام فایل
                  const fileName =
                    item.media.file?.split("/").pop() || "فایل بدون نام";
                  const shortFileName =
                    fileName.length > 25
                      ? `${fileName.substring(0, 22)}...`
                      : fileName;

                  return (
                    <div
                      key={item.id}
                      className="pr-4 border-r-2 border-gold/30 space-y-3 bg-gold/[0.02] p-4 rounded-r-xl"
                    >
                      {item.media.text && (
                        <p className="text-cream/80 text-sm leading-7 whitespace-pre-wrap">
                          {item.media.text}
                        </p>
                      )}

                      {item.media.file && (
                        <a
                          href={
                            item.media.file.startsWith("http")
                              ? item.media.file
                              : `${MEDIA_BASE_URL}${item.media.file}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          title={fileName} // ✅ نمایش نام کامل هنگام هاور کردن ماوس
                          className="inline-flex items-center gap-2 text-xs text-gold/80 hover:text-gold bg-gold/5 hover:bg-gold/10 px-3 py-2 rounded-lg transition-colors border border-gold/10 max-w-fit"
                        >
                          <FiDownload size={14} className="shrink-0" />
                          {/* ✅ محدود کردن عرض و کوتاه‌سازی خودکار */}
                          <span className="truncate max-w-[160px]">
                            {shortFileName}
                          </span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* بخش ۲: گفتگو (Chat) */}
        <div className="flex flex-col bg-gold/[0.02] border-t border-white/5 h-[450px]">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.01]">
            <FiMessageSquare className="text-gold" size={16} />
            <h3 className="text-sm font-semibold text-cream/90">
              گفتگو و بازخورد
            </h3>
          </div>

          {/* لیست پیام‌ها */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {loadingMessages ? (
              <div className="flex justify-center py-8">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
              </div>
            ) : !conversation?.messages ||
              conversation.messages.length === 0 ? (
              <div className="text-center py-8 text-cream/40 text-sm">
                هنوز پیامی در این گفتگو رد و بدل نشده است. اولین بازخورد را شما
                ثبت کنید!
              </div>
            ) : (
              conversation.messages.map((msg) => {
                // ✅ لاگ دیباگ: ساختار دقیق پیام را در کنسول ببینید
                console.log("🔍 DEBUG Message Object:", msg);

                const isMe = isMyMessage(msg.sender);

                // ✅ پشتیبانی از هر دو حالت: text مستقیم یا داخل media
                const messageText = msg.text || msg.media?.text;
                const messageFile = msg.file || msg.media?.file;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isMe
                          ? "bg-gold text-deep rounded-br-none"
                          : "bg-cream/10 text-cream border border-white/5 rounded-bl-none"
                      }`}
                    >
                      {!isMe && (
                        <p className="text-[10px] font-bold text-gold mb-1">
                          {msg.sender}
                        </p>
                      )}

                      {/* ✅ نمایش متن پیام */}
                      {messageText && (
                        <p className="text-sm whitespace-pre-wrap mb-2">
                          {messageText}
                        </p>
                      )}

                      {/* ✅ نمایش فایل پیوست (اگر وجود داشته باشد) */}
                      {messageFile && (
                        <a
                          href={
                            messageFile.startsWith("http")
                              ? messageFile
                              : `${MEDIA_BASE_URL}${messageFile}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1 text-xs mt-1 px-2 py-1 rounded ${
                            isMe
                              ? "bg-deep/10 hover:bg-deep/20"
                              : "bg-black/20 hover:bg-black/30"
                          } transition-colors`}
                        >
                          <FiPaperclip size={12} />
                          فایل پیوست
                        </a>
                      )}

                      <p
                        className={`text-[10px] mt-1.5 text-right ${
                          isMe ? "text-deep/60" : "text-cream/40"
                        }`}
                      >
                        {formatJalaliDateTime(new Date(msg.created_at))}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* فرم ارسال پیام */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="بازخورد یا پاسخ خود را بنویسید..."
                  rows={2}
                  className="w-full rounded-xl border border-cream/10 bg-deep/50 px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 resize-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-lg w-fit border border-gold/20">
                    <FiPaperclip size={12} />
                    <span className="truncate max-w-[150px]">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="hover:text-red-400 ml-1 font-bold"
                    >
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
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </label>

                <button
                  onClick={handleSendMessage}
                  disabled={
                    sendingMessage || (!newMessage.trim() && !selectedFile)
                  }
                  className="p-3 rounded-xl bg-gold text-deep hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-gold/10"
                >
                  {sendingMessage ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-deep/30 border-t-deep"></span>
                  ) : (
                    <FiSend size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
