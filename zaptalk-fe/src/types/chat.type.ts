import type { SuccessResponse } from "./response.type";

export interface DeleteChatHistoryRequestBody {
  channelId: string;
}

export type DeleteChatResponse = SuccessResponse<void>;
