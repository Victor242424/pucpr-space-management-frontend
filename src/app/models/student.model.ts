export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Student {
  id: number;
  registrationNumber: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  registrationNumber: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}