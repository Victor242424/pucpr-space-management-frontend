export enum AccessStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface AccessRecord {
  id: number;
  studentId: number;
  studentName: string;
  studentRegistrationNumber: string;
  spaceId: number;
  spaceName: string;
  spaceCode: string;
  entryTime: string;
  exitTime?: string;
  durationInMinutes?: number;
  status: AccessStatus;
  notes?: string;
  createdAt: string;
}

export interface EntryRequest {
  studentId: number;
  spaceId: number;
  notes?: string;
}

export interface ExitRequest {
  accessRecordId: number;
  notes?: string;
}