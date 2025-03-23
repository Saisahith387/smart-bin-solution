
import { v4 as uuidv4 } from 'uuid';
import { PickupSchedule, Issue, PickupStatus, IssueStatus } from '@/types';
import schedulesData from '@/data/schedules.json';

// Pickup Schedules
export const getSchedules = (): PickupSchedule[] => {
  try {
    const schedules = localStorage.getItem('eco_schedules');
    if (schedules) {
      return JSON.parse(schedules);
    }
    // Initialize with data from JSON file if not in localStorage
    localStorage.setItem('eco_schedules', JSON.stringify(schedulesData));
    return schedulesData;
  } catch (error) {
    console.error('Failed to get schedules:', error);
    return [];
  }
};

export const addSchedule = (schedule: Omit<PickupSchedule, 'id' | 'status'>): PickupSchedule => {
  try {
    const schedules = getSchedules();
    const newSchedule: PickupSchedule = {
      ...schedule,
      id: uuidv4(),
      status: 'scheduled'
    };
    
    const updatedSchedules = [...schedules, newSchedule];
    localStorage.setItem('eco_schedules', JSON.stringify(updatedSchedules));
    return newSchedule;
  } catch (error) {
    console.error('Failed to add schedule:', error);
    throw error;
  }
};

export const updateScheduleStatus = (scheduleId: string, status: PickupStatus, collectorId?: string): PickupSchedule | null => {
  try {
    const schedules = getSchedules();
    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
    
    if (scheduleIndex === -1) {
      return null;
    }
    
    const updatedSchedule = {
      ...schedules[scheduleIndex],
      status,
      collectedBy: collectorId,
      collectedAt: status === 'collected' || status === 'missed' ? new Date().toISOString() : undefined
    };
    
    schedules[scheduleIndex] = updatedSchedule;
    localStorage.setItem('eco_schedules', JSON.stringify(schedules));
    return updatedSchedule;
  } catch (error) {
    console.error('Failed to update schedule status:', error);
    return null;
  }
};

// Issues
export const getIssues = (): Issue[] => {
  try {
    const issues = localStorage.getItem('eco_issues');
    if (issues) {
      return JSON.parse(issues);
    }
    return [];
  } catch (error) {
    console.error('Failed to get issues:', error);
    return [];
  }
};

export const addIssue = (issue: Omit<Issue, 'id' | 'status' | 'reportedAt'>): Issue => {
  try {
    const issues = getIssues();
    const newIssue: Issue = {
      ...issue,
      id: uuidv4(),
      status: 'reported',
      reportedAt: new Date().toISOString()
    };
    
    const updatedIssues = [...issues, newIssue];
    localStorage.setItem('eco_issues', JSON.stringify(updatedIssues));
    return newIssue;
  } catch (error) {
    console.error('Failed to add issue:', error);
    throw error;
  }
};

export const updateIssueStatus = (issueId: string, status: IssueStatus, adminId?: string): Issue | null => {
  try {
    const issues = getIssues();
    const issueIndex = issues.findIndex(i => i.id === issueId);
    
    if (issueIndex === -1) {
      return null;
    }
    
    const updatedIssue = {
      ...issues[issueIndex],
      status,
      resolvedBy: status === 'resolved' ? adminId : issues[issueIndex].resolvedBy,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : issues[issueIndex].resolvedAt
    };
    
    issues[issueIndex] = updatedIssue;
    localStorage.setItem('eco_issues', JSON.stringify(issues));
    return updatedIssue;
  } catch (error) {
    console.error('Failed to update issue status:', error);
    return null;
  }
};

// Stats for analytics
export const getCollectionStats = () => {
  const schedules = getSchedules();
  
  const total = schedules.length;
  const collected = schedules.filter(s => s.status === 'collected').length;
  const missed = schedules.filter(s => s.status === 'missed').length;
  const scheduled = schedules.filter(s => s.status === 'scheduled').length;
  
  // Group by waste type
  const wasteTypeData = [
    { name: 'General', value: schedules.filter(s => s.wasteType === 'general').length },
    { name: 'Recycling', value: schedules.filter(s => s.wasteType === 'recycling').length },
    { name: 'Compost', value: schedules.filter(s => s.wasteType === 'compost').length },
    { name: 'Hazardous', value: schedules.filter(s => s.wasteType === 'hazardous').length }
  ];
  
  // Group by area
  const areas = [...new Set(schedules.map(s => s.area))];
  const areaData = areas.map(area => ({
    name: area,
    total: schedules.filter(s => s.area === area).length,
    collected: schedules.filter(s => s.area === area && s.status === 'collected').length,
    missed: schedules.filter(s => s.area === area && s.status === 'missed').length,
    scheduled: schedules.filter(s => s.area === area && s.status === 'scheduled').length
  }));
  
  // Issues stats
  const issues = getIssues();
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const pendingIssues = issues.filter(i => i.status !== 'resolved').length;
  
  return {
    collections: { total, collected, missed, scheduled },
    wasteTypeData,
    areaData,
    issues: { total: totalIssues, resolved: resolvedIssues, pending: pendingIssues }
  };
};
