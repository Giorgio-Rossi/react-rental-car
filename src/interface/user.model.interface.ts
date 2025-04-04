export interface User {
    id?: number | null;
    username: string;
    email: string;
    role: string;
    password: string;
    fullName: string;  

    [key: string]: any;
  }
  