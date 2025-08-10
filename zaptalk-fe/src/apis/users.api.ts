import type { searchUsersResponse } from "@/types/user.type";
import http from "../utils/http";

export const URL_SEARCH_USERS = "/users/search";

const userApi = {
  searchUsers: (query: string) =>
    http.get<searchUsersResponse>(`${URL_SEARCH_USERS}?query=${query}`),
};
export default userApi;
