import type { SuccessResponse } from "./response.type";
import type { User } from "./user.type";

export interface DeleteChatHistoryRequestBody {
  channelId: string;
}

export type DeleteChatResponse = SuccessResponse<void>;
