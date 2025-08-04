type Role = "ADMIN" | "MEMBER";
export interface User {
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  username: string;
  phone_number: string;
  role: Role;
}
