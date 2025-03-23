
export type UserRole = 'resident' | 'collector' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface PickupSchedule {
  id: string;
  area: string;
  address: string;
  date: string;
  time: string;
  wasteType: WasteType;
  status: PickupStatus;
  collectedBy?: string;
  collectedAt?: string;
}

export type PickupStatus = 'scheduled' | 'collected' | 'missed';
export type WasteType = 'general' | 'recycling' | 'compost' | 'hazardous';

export interface Issue {
  id: string;
  title: string;
  description: string;
  area: string;
  address: string;
  reportedBy: string;
  reportedAt: string;
  status: IssueStatus;
  resolvedBy?: string;
  resolvedAt?: string;
}

export type IssueStatus = 'reported' | 'in-progress' | 'resolved';

export interface WasteGuideItem {
  category: string;
  items: string[];
  description: string;
  disposalMethod: string;
}
