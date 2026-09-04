"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useMemberAssignmentDetail,
  useMemberSubmissions,
  useMemberSubmissionDetail,
} from "@/hooks/useAssignment";
import { useConversationDetail, useSendMessage } from "@/hooks/useConversation"; // ✅ اضافه شد
import AssignmentSubmissionForm from "@/forms/AssignmentSubmissionForm";
import { useState, useRef, useEffect } from "react"; // ✅ اضافه شد
import {
  FiArrowRight,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiDownload,
  FiPaperclip,
  FiMessageSquare, // ✅ اضافه شد
  FiSend, // ✅ اضافه شد
  FiX, // ✅ اضافه شد
} from "react-icons/fi";
import { formatJalaliDateTime } from "@/lib/jalaali";
import { MEDIA_BASE_URL } from "@/lib/axios";

export default function MemberAssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const lineId = params.id as string;
  const assignmentId = params.assignmentId as string;

  const { data: assignment, isLoading: loadingAssignment } =
    useMemberAssignmentDetail(lineId, assignmentId);

  const { data: submissionsData, isLoading: loadingSubmissionsList } =
    useMemberSubmissions(lineId, assignmentId, { page: 1 });

  const firstSubmission = submissionsData?.results?.[0];
  const hasSubmitted = !!firstSubmission;
  const submissionId = firstSubmission?.id;

  const { data: submissionDetail, isLoading: loadingSubmissionDetail } =
    useMemberSubmissionDetail(lineId, assignmentId, submissionId || "");

  // ✅ هوک‌های مربوط به گفتگو (Conversation)
  const conversationId = submissionDetail?.conversation;
  const { data: conversation, isLoading: loadingMessages } =
    useConversationDetail(conversationId, "member");

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

  const isLoading =
    loadingAssignment || loadingSubmissionsList || loadingSubmissionDetail;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-cream/30 text-sm">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold"></span>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-cream/30 text-sm">
          تکلیف یافت نشد یا دسترسی ندارید.
        </p>
        <button
          onClick={() => router.back()}
          className="text-gold text-sm hover:underline"
        >
          بازگشت
        </button>
      </div>
    );
  }

  // ✅ تشخیص اینکه آیا پیام از طرف خود عضو (من) بوده یا کارمند
  const isMyMessage = (senderName: string) => {
    return senderName === submissionDetail?.member;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header ساده و تمیز */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full text-cream/40 hover:text-cream hover:bg-cream/5 transition-colors shrink-0"
        >
          <FiArrowRight size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <h1
            className="text-xl md:text-2xl font-bold text-cream truncate"
            title={assignment.title}
          >
            {assignment.title.length > 45
              ? `${assignment.title.substring(0, 42)}...`
              : assignment.title}
          </h1>
          <p className="text-cream/50 text-sm mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span>
            <span className="truncate">{assignment.line}</span>
          </p>
        </div>
      </div>

      {/* کانتینر اصلی یکپارچه */}
      <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        {/* بخش ۱: اطلاعات تکلیف */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-gold/10 text-gold shrink-0">
              <FiFileText size={20} />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-sm font-semibold text-cream/80">
                توضیحات تکلیف
              </h3>
              <p className="text-cream/70 text-sm leading-7 whitespace-pre-wrap">
                {assignment.description || "توضیحات خاصی ثبت نشده است."}
              </p>
            </div>
          </div>

          {assignment.media_items && assignment.media_items.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-gold/10 text-gold shrink-0">
                <FiPaperclip size={20} />
              </div>
              <div className="space-y-3 flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-cream/80">
                  فایل‌های پیوست تکلیف
                </h3>
                <div className="space-y-2">
                  {assignment.media_items.map((item) => {
                    const fileName =
                      item.media.text ||
                      item.media.file?.split("/").pop() ||
                      "فایل بدون عنوان";
                    const shortName =
                      fileName.length > 30
                        ? `${fileName.substring(0, 27)}...`
                        : fileName;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-cream/10 bg-cream/[0.02] hover:bg-cream/[0.04] transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gold/5 text-gold/70 shrink-0">
                          <FiFileText size={14} />
                        </div>
                        <p
                          className="text-cream text-sm flex-1 min-w-0 truncate"
                          title={fileName}
                        >
                          {shortName}
                        </p>
                        {item.media.file && (
                          <a
                            href={
                              item.media.file.startsWith("http")
                                ? item.media.file
                                : `${MEDIA_BASE_URL}${item.media.file}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-gold bg-gold/10 hover:bg-gold/20 px-3 py-1.5 rounded-lg transition-colors border border-gold/20 shrink-0"
                          >
                            <FiDownload size={12} />
                            دانلود
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-cream/40 text-xs pt-4 border-t border-white/5">
            <FiClock size={14} />
            <span>
              تاریخ ایجاد:{" "}
              {formatJalaliDateTime(new Date(assignment.created_at))}
            </span>
          </div>
        </div>

        {/* بخش ۲: پاسخ‌های ثبت‌شده (فقط در صورت وجود) */}
        {hasSubmitted &&
          submissionDetail &&
          submissionDetail.media_items.length > 0 && (
            <div className="border-t border-white/5 bg-green-500/[0.03] p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FiCheckCircle className="text-green-400" size={16} />
                <h3 className="text-sm font-semibold text-green-400/90">
                  پاسخ‌های ثبت‌شده‌ی شما
                </h3>
              </div>

              <div className="space-y-4">
                {submissionDetail.media_items.map((item) => {
                  const fileName =
                    item.media.file?.split("/").pop() || "فایل بدون نام";
                  const shortFileName =
                    fileName.length > 25
                      ? `${fileName.substring(0, 22)}...`
                      : fileName;

                  return (
                    <div
                      key={item.id}
                      className="group relative pr-4 border-r-2 border-gold/30 space-y-2"
                    >
                      {item.media.text && (
                        <p className="text-cream/80 text-sm leading-6 whitespace-pre-wrap">
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
                          title={fileName}
                          className="inline-flex items-center gap-2 text-xs text-gold/80 hover:text-gold bg-gold/5 hover:bg-gold/10 px-3 py-2 rounded-lg transition-colors border border-gold/10 max-w-fit"
                        >
                          <FiDownload size={14} className="shrink-0" />
                          <span className="truncate max-w-[160px]">
                            {shortFileName}
                          </span>
                        </a>
                      )}
                      <span className="absolute top-0 left-0 text-[10px] text-cream/30">
                        {formatJalaliDateTime(
                          new Date(submissionDetail.created_at),
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* ✅ بخش ۳: گفتگو با کارمند (فقط اگر سابمیشن و کانورسیشن وجود داشته باشد) */}
        {hasSubmitted && conversationId && (
          <div className="border-t border-white/5 bg-gold/[0.02] flex flex-col h-[450px]">
            <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.01] shrink-0">
              <FiMessageSquare className="text-gold" size={16} />
              <h3 className="text-sm font-semibold text-cream/90">
                گفتگو با کارمند
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
                  هنوز بازخوردی از طرف کارمند ثبت نشده است.
                </div>
              ) : (
                conversation.messages.map((msg) => {
                  const isMe = isMyMessage(msg.sender);
                  const messageText = msg.text || msg.media?.text;
                  const messageFile = msg.file || msg.media?.file;

                  // ✅ تعیین نام فرستنده: "شما" برای خود کاربر، یا نام ارسال‌کننده برای کارمند
                  const senderName = isMe ? "شما" : msg.sender || "کارمند";

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          isMe
                            ? "bg-cream/10 text-cream border border-white/5 rounded-bl-none"
                            : "bg-gold text-deep rounded-br-none"
                        }`}
                      >
                        {/* ✅ نمایش نام فرستنده بالای متن پیام */}
                        <p
                          className={`text-[10px] font-bold mb-1.5 ${isMe ? "text-gold" : "text-deep/60"}`}
                        >
                          {senderName}
                        </p>

                        {messageText && (
                          <p className="text-sm whitespace-pre-wrap mb-2">
                            {messageText}
                          </p>
                        )}

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
                                ? "bg-black/20 hover:bg-black/30"
                                : "bg-deep/10 hover:bg-deep/20"
                            } transition-colors`}
                          >
                            <FiPaperclip size={12} />
                            فایل پیوست
                          </a>
                        )}

                        <p
                          className={`text-[10px] mt-1.5 text-right ${isMe ? "text-cream/40" : "text-deep/60"}`}
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

            {/* فرم ارسال پیام توسط عضو */}
            <div className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="پاسخ یا سوال خود را بنویسید..."
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
        )}

        {/* بخش ۴: فرم ارسال/ویرایش پاسخ */}
        <div className="border-t border-white/5 p-6 md:p-8 bg-white/[0.01]">
          <div className="flex items-center gap-2 mb-6">
            <FiPaperclip className="text-gold" size={16} />
            <h3 className="text-sm font-semibold text-cream/80">
              {hasSubmitted ? "ویرایش یا تکمیل پاسخ" : "ارسال پاسخ جدید"}
            </h3>
          </div>

          <AssignmentSubmissionForm
            assignmentId={assignmentId}
            mode={hasSubmitted ? "update" : "create"}
            initialData={submissionDetail || undefined}
            onSuccess={() => window.location.reload()}
          />
        </div>
      </div>
    </div>
  );
}
