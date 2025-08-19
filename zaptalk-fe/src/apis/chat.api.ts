import type {
  DeleteChatHistoryRequestBody,
  DeleteChatResponse,
} from "@/types/chat.type";
import type { VerifyEmailRequestBody } from "../components/auth/EmailVerifiedResult";
import type {
  RegisterResponse,
  LoginFormData,
  VerifyEmailResponse,
  RegisterFormData,
  LoginResponse,
  RefreshTokenRequestBody,
} from "../types/auth.type";

import http from "../utils/http";

export const URL_DELETE_CHAT_HISTORY = "/chats";

const chatApi = {
  deleteChatHistory: (body: DeleteChatHistoryRequestBody) =>
    http.delete<DeleteChatResponse>(URL_DELETE_CHAT_HISTORY, { data: body }),
};
export default chatApi;
