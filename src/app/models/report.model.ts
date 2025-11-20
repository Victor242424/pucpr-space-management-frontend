export interface OccupancyReport {
  spaceId: number;
  spaceName: string;
  spaceCode: string;
  capacity: number;
  currentOccupancy: number;
  occupancyRate: number;
  totalAccessesToday: number;
  totalAccessesThisWeek: number;
  totalAccessesThisMonth: number;
  averageDurationInMinutes: number;
}