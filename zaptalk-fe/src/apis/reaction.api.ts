import type {
  AddReactionReqBody,
  AddReactionResponse,
} from "@/types/reaction.type";
import http from "../utils/http";

export const URL_ADD_REACTION = "/auth/register";

const authApi = {
  addReactionToMessage: (body: AddReactionReqBody) =>
    http.post<AddReactionResponse>(URL_ADD_REACTION, {
      body,
    }),
};
export default authApi;
