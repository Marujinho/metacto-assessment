export interface User {
  id: number;
  username: string;
  email: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}
