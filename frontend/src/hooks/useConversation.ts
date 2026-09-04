import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { CONVERSATION_ENDPOINTS } from "@/services/api/endpoints";
import { buildFormData, containsFile } from "@/services/api/formData";

export interface Message {
  id: number;
  sender: string;
  text?: string;
  file?: string | null;
  media: {
    id: number;
    text: string;
    file: string | null;
  } | null;
  created_at: string;
}

export interface ConversationDetail {
  id: string; 
  line: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}


export const useConversationDetail = (conversationId: string | number | null | undefined, role: "staff" | "member" = "staff") => {
  return useQuery<ConversationDetail>({
    queryKey: ["conversation", "detail", conversationId],
    queryFn: async () => {
      const endpoint = role === "staff" 
        ? CONVERSATION_ENDPOINTS.staffDetail(conversationId!)
        : CONVERSATION_ENDPOINTS.memberDetail(conversationId!);
        
      const res = await apiClient.get<ConversationDetail>(endpoint);
      return res.data;
    },
    enabled: !!conversationId,
    refetchInterval: 8000,
  });
};


export const useSendMessage = (conversationId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { text?: string; file?: File | null }) => {
      const isFormData = containsFile(data);
      const payload = isFormData ? buildFormData(data as Record<string, unknown>) : data;

      const res = await apiClient.post<Message>(
        CONVERSATION_ENDPOINTS.messageCreate(conversationId),
        payload,
        {
          headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", "detail", conversationId] });
    },
  });
};