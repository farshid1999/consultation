// hooks/useConsultation.ts

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {consultationService} from "@/services/consultationService";
import {toast} from "sonner";

export const QUERY_KEYS = {
    consultationForm: (lineId: string | number) => ["consultation-form", lineId],
    submissions: (consultationId: string) => ["consultation-submissions", consultationId],
    submissionDetail: (consultationId: string, memberId: string) =>
    ["submission-detail", consultationId, memberId],
    memberForm: (lineId: string) => ["member-consultation-form", lineId],
    myResponse: (consultationId: string, memberId: string) => ["my-consultation-response", consultationId, memberId],
};

export function useConsultationForm(lineId: string | number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.consultationForm(lineId!),
        queryFn: () => consultationService.getForm(lineId!),
        enabled: !!lineId,
        retry: false, // چون 404 برای ما یک حالت عادی است (عدم وجود فرم)
    });
}

export function useSaveConsultationForm(lineId: string | number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({payload, isEdit}: { payload: FormData; isEdit: boolean }) =>
            isEdit
                ? consultationService.updateForm(lineId, payload)
                : consultationService.createForm(lineId, payload),

        onSuccess: (_, variables) => {
            toast.success(variables.isEdit ? "فرم با موفقیت ویرایش شد." : "فرم با موفقیت ایجاد شد.");
            queryClient.invalidateQueries({queryKey: QUERY_KEYS.consultationForm(lineId)});
        },
        onError: (err: any) => {
            toast.error(err.message || "خطا در ذخیره فرم");
        },
    });
}


export function useConsultationSubmissions(consultationId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.submissions(consultationId!),
    queryFn: () => consultationService.getSubmissions(consultationId!),
    enabled: !!consultationId,
  });
}

export function useMyResponse(consultationId: string | null, memberId: string | null) {
    return useQuery({
        queryKey: QUERY_KEYS.myResponse(consultationId!, memberId!),
        queryFn: () => consultationService.getMyResponse(consultationId!, memberId!),
        enabled: !!consultationId && !!memberId,
        retry: false,
    });
}


export function useSubmissionDetail(consultationId: string | null, memberId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.submissionDetail(consultationId!, memberId!),
    queryFn: () => consultationService.getSubmissionDetail(consultationId!, memberId!),
    enabled: !!consultationId && !!memberId,
  });
}

export function useMemberConsultationForm(lineId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.memberForm(lineId!),
    queryFn: () => consultationService.getMemberForm(lineId!),
    enabled: !!lineId,
  });
}

export function useSubmitResponse(consultationId: string, memberId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) =>
      consultationService.submitResponse(consultationId, memberId, payload),

    onSuccess: () => {
      toast.success("پاسخ شما با موفقیت ثبت شد.");
      // اینوالید کردن کوئری فرم برای رفرش شدن وضعیت (اگر لازم باشد)
      // یا ریدایرکت به صفحه دیگری
    },
    onError: (err: any) => {
      toast.error(err.message || "خطا در ثبت پاسخ");
    },
  });
}


export function useUpdateResponse(consultationId: string, memberId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: FormData) =>
            consultationService.updateResponse(consultationId, memberId, payload),

        onSuccess: () => {
            toast.success("پاسخ شما با موفقیت ویرایش شد.");
            queryClient.invalidateQueries({queryKey: QUERY_KEYS.myResponse(consultationId, memberId)});
        },
        onError: (err: any) => {
            toast.error(err.message || "خطا در ویرایش پاسخ");
        },
    });
}