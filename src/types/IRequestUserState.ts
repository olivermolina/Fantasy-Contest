export interface IRequestUserState {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: any;
  registrationToken?: any;
  isActive: boolean;
  blocked?: any;
  preferedLanguage?: any;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
