import type { SuccessResponse } from "./response.type";

export interface AddReactionReqBody {
  channelId: string;
  messageId: string;
  type: string;
}

export type AddReactionResponse = SuccessResponse<{
  message: string;
  data: {
    message: object;
    reaction: object;
    duration: string;
  };
}>;
