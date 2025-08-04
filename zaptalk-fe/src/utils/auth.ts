import type { User } from "../types/user.type";

export const LocalStorageEventTarget = new EventTarget();

export const clearLocalStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
  const clearLocalStorageEventTarget = new Event("clearLocalStorage");
  LocalStorageEventTarget.dispatchEvent(clearLocalStorageEventTarget);
};

// access token
export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("access_token") || "";
};
export const setAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem("access_token", accessToken);
};

// profile
export const getProfileFromLocalStorage = () => {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
};
export const setProfileToLocalStorage = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
