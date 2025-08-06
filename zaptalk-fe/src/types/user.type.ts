type Role = "ADMIN" | "MEMBER";
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  avatar_url: string;
  username: string;
  phone_number: string;
  role: Role;
}
