export enum SpaceType {
  CLASSROOM = 'CLASSROOM',
  LABORATORY = 'LABORATORY',
  STUDY_ROOM = 'STUDY_ROOM'
}

export enum SpaceStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface Space {
  id: number;
  code: string;
  name: string;
  type: SpaceType;
  capacity: number;
  building?: string;
  floor?: string;
  description?: string;
  status: SpaceStatus;
  currentOccupancy: number;
  createdAt: string;
  updatedAt: string;
}