// services/consultationService.ts

import {apiClient} from "@/lib/axios";
import {extractApiError} from "@/services/api/errors";
import type {
    ConsultationFormDetail,
    ConsultationFormInput,
    ConsultationSubmission, PaginatedResponse,
    SubmitConsultationForm
} from "@/types";
import {CONSULTATION_ENDPOINTS} from "./api/endpoints";


export const consultationService = {
    /** GET /api/operations/cosultation/staff/<line_id>/ */
    async getForm(lineId: string | number): Promise<ConsultationFormDetail> {
        try {
            const {data} = await apiClient.get<ConsultationFormDetail>(CONSULTATION_ENDPOINTS.form(lineId));
            return data;
        } catch (error: any) {
            // اگر 404 بود یعنی فرمی وجود ندارد
            if (error.response?.status === 404) {
                return null as any;
            }
            throw extractApiError(error);
        }
    },

    /** POST /api/operations/cosultation/staff/<line_id>/ */
    async createForm(lineId: string | number, payload: FormData): Promise<ConsultationFormDetail> {
        try {
            // نیازی به ست کردن Content-Type نیست، مرورگر خودش انجام می‌دهد
            const {data} = await apiClient.post(
                CONSULTATION_ENDPOINTS.form(lineId),
                payload
            );
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    /** PATCH /api/operations/cosultation/staff/<line_id>/ */
    async updateForm(lineId: string | number, payload: FormData): Promise<ConsultationFormDetail> {
        try {
            const {data} = await apiClient.patch(CONSULTATION_ENDPOINTS.form(lineId), payload, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getSubmissions(consultationId: string): Promise<ConsultationSubmission[]> {
        try {
            // فرض بر این است که بک‌اند پاسخ Paginated برمی‌گرداند
            const {data} = await apiClient.get<PaginatedResponse<ConsultationSubmission>>(
                CONSULTATION_ENDPOINTS.submissions(consultationId)
            );

            // اگر پاسخ صفحه‌بندی شده باشد، results را برمی‌گردانیم، در غیر این صورت خود data
            return Array.isArray(data) ? data : (data.results || []);
        } catch (error) {
            throw extractApiError(error);
        }
    },


    async getSubmissionDetail(consultationId: string, memberId: string): Promise<SubmitConsultationForm> {
        try {
            const {data} = await apiClient.get<SubmitConsultationForm>(
                CONSULTATION_ENDPOINTS.submissionDetail(consultationId, memberId)
            );
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },


    async getMemberForm(lineId: string): Promise<ConsultationFormDetail> {
        try {
            const {data} = await apiClient.get(CONSULTATION_ENDPOINTS.memberForm(lineId));
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async submitResponse(consultationId: string, memberId: string, payload: FormData): Promise<any> {
        try {
            const {data} = await apiClient.post(
                CONSULTATION_ENDPOINTS.submitResponse(consultationId, memberId),
                payload
            );
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },


    /** PATCH — وقتی عضو قبلاً پاسخ داده و حالا دارد ویرایشش می‌کند. */
    async updateResponse(consultationId: string, memberId: string, payload: FormData): Promise<SubmitConsultationForm> {
        try {
            const {data} = await apiClient.patch(
                CONSULTATION_ENDPOINTS.memberResponse(consultationId, memberId),
                payload
            );
            return data;
        } catch (error) {
            throw extractApiError(error);
        }
    },

    async getMyResponse(consultationId: string, memberId: string): Promise<SubmitConsultationForm | null> {
        try {
            const {data} = await apiClient.get<SubmitConsultationForm>(
                CONSULTATION_ENDPOINTS.memberResponse(consultationId, memberId)
            );
            return data;
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            throw extractApiError(error);
        }
    },
};