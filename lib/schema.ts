// ============================================
// BookingTimes Portfolio Showcase - Schema Types
// Author: Tumara Hall | CB Tech Trust
// ============================================

export type AppointmentStatus = 
  | 'confirmed' 
  | 'pending' 
  | 'conflict' 
  | 'cancelled' 
  | 'completed';

export type ServiceType = 
  | 'General Consultation'
  | 'Full Service'
  | 'Quick Check'
  | 'Premium Package'
  | 'Emergency Slot';

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: ServiceType;
  startTime: Date;
  endTime: Date;
  resourceId: string;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  capacity: number;
  availability: 'available' | 'busy' | 'offline';
  specializations: string[];
  color: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  triggeredBy: 'user' | 'ai_agent' | 'system';
  actionType: 
    | 'schedule_create'
    | 'schedule_update'
    | 'schedule_cancel'
    | 'conflict_detected'
    | 'conflict_resolved'
    | 'report_generated'
    | 'ai_query_executed';
  executionTimeMs: number;
  generatedTSQL?: string;
  affectedRecords: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required: boolean;
  }>;
}

export interface AgentThought {
  type: 'thinking' | 'executing' | 'validating' | 'result';
  content: string;
  timestamp: Date;
  toolUsed?: string;
  executionTimeMs?: number;
}

export interface AgentResponse {
  id: string;
  query: string;
  thoughts: AgentThought[];
  result: {
    success: boolean;
    summary: string;
    data?: Record<string, unknown>;
    actions?: AgentAction[];
  };
  totalExecutionTimeMs: number;
}

export interface AgentAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  requiresConfirmation: boolean;
  action: string;
}

export interface TimeSlot {
  date: Date;
  hour: number;
  resourceId: string;
  appointment?: Appointment;
  isAvailable: boolean;
}

export interface WeekView {
  startDate: Date;
  endDate: Date;
  days: DayView[];
}

export interface DayView {
  date: Date;
  dayName: string;
  slots: TimeSlot[];
  totalBookings: number;
  utilizationPercent: number;
}

export interface ConflictAnalysis {
  conflictingAppointments: Appointment[];
  resourceId: string;
  timeSlot: {
    start: Date;
    end: Date;
  };
  severity: 'low' | 'medium' | 'high';
  suggestedResolutions: Resolution[];
}

export interface Resolution {
  id: string;
  description: string;
  newTimeSlot?: {
    start: Date;
    end: Date;
    resourceId: string;
  };
  estimatedImpact: string;
  confidence: number;
}

export interface RevenueMetrics {
  date: Date;
  totalRevenue: number;
  projectedRevenue: number;
  utilizationRate: number;
  averageBookingValue: number;
  unutilizedSlots: number;
  potentialRevenueLoss: number;
}

export interface CustomerInsight {
  customerId: string;
  customerName: string;
  totalSpend: number;
  visitCount: number;
  lastVisit: Date;
  daysSinceLastVisit: number;
  preferredServices: ServiceType[];
  churnRisk: 'low' | 'medium' | 'high';
  lifetimeValue: number;
}
