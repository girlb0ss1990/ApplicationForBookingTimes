// ============================================
// BookingTimes Portfolio Showcase - Mock Data
// Author: Tumara Hall | CB Tech Trust
// ============================================

import { 
  Appointment, 
  Resource, 
  AuditLogEntry, 
  CustomerInsight,
  RevenueMetrics 
} from './schema';

// Helper to create dates relative to today
const today = new Date();
const getDate = (daysOffset: number, hour: number, minute: number = 0): Date => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

// Resources/Staff
export const mockResources: Resource[] = [
  {
    id: 'res-001',
    name: 'Dr. Sarah Mitchell',
    role: 'Senior Consultant',
    capacity: 8,
    availability: 'available',
    specializations: ['General Consultation', 'Premium Package'],
    color: '#6366f1',
  },
  {
    id: 'res-002',
    name: 'James Wong',
    role: 'Specialist Technician',
    capacity: 10,
    availability: 'busy',
    specializations: ['Full Service', 'Quick Check'],
    color: '#10b981',
  },
  {
    id: 'res-003',
    name: 'Emily Parker',
    role: 'Service Coordinator',
    capacity: 12,
    availability: 'available',
    specializations: ['Emergency Slot', 'Quick Check'],
    color: '#f59e0b',
  },
  {
    id: 'res-004',
    name: 'Michael Chen',
    role: 'Lead Technician',
    capacity: 8,
    availability: 'offline',
    specializations: ['Premium Package', 'Full Service'],
    color: '#ec4899',
  },
];

// Appointments with realistic booking scenarios
export const mockAppointments: Appointment[] = [
  // Today's appointments
  {
    id: 'apt-001',
    customerName: 'John Richardson',
    customerEmail: 'john.r@email.co.nz',
    customerPhone: '+64 27 555 1234',
    serviceType: 'General Consultation',
    startTime: getDate(0, 9, 0),
    endTime: getDate(0, 10, 0),
    resourceId: 'res-001',
    status: 'confirmed',
    price: 150,
    notes: 'Follow-up from last week',
    createdAt: getDate(-3, 14, 30),
    updatedAt: getDate(-1, 10, 15),
  },
  {
    id: 'apt-002',
    customerName: 'Maria Gonzales',
    customerEmail: 'maria.g@business.co.nz',
    customerPhone: '+64 21 555 5678',
    serviceType: 'Premium Package',
    startTime: getDate(0, 10, 30),
    endTime: getDate(0, 12, 30),
    resourceId: 'res-001',
    status: 'confirmed',
    price: 450,
    createdAt: getDate(-7, 9, 0),
    updatedAt: getDate(-7, 9, 0),
  },
  {
    id: 'apt-003',
    customerName: 'David Thompson',
    customerEmail: 'david.t@gmail.com',
    customerPhone: '+64 22 555 9012',
    serviceType: 'Quick Check',
    startTime: getDate(0, 11, 0),
    endTime: getDate(0, 11, 30),
    resourceId: 'res-002',
    status: 'pending',
    price: 75,
    notes: 'New customer - first visit',
    createdAt: getDate(-1, 16, 45),
    updatedAt: getDate(-1, 16, 45),
  },
  {
    id: 'apt-004',
    customerName: 'Sarah Williams',
    customerEmail: 'sarah.w@corp.co.nz',
    customerPhone: '+64 27 555 3456',
    serviceType: 'Full Service',
    startTime: getDate(0, 14, 0),
    endTime: getDate(0, 16, 0),
    resourceId: 'res-003',
    status: 'confirmed',
    price: 320,
    createdAt: getDate(-5, 11, 20),
    updatedAt: getDate(-2, 9, 30),
  },
  // Tomorrow's appointments with a conflict scenario
  {
    id: 'apt-005',
    customerName: 'Robert Chen',
    customerEmail: 'robert.c@tech.co.nz',
    customerPhone: '+64 21 555 7890',
    serviceType: 'Premium Package',
    startTime: getDate(1, 10, 0),
    endTime: getDate(1, 12, 0),
    resourceId: 'res-001',
    status: 'confirmed',
    price: 450,
    createdAt: getDate(-10, 15, 0),
    updatedAt: getDate(-10, 15, 0),
  },
  {
    id: 'apt-006',
    customerName: 'Lisa Anderson',
    customerEmail: 'lisa.a@company.co.nz',
    customerPhone: '+64 22 555 2345',
    serviceType: 'General Consultation',
    startTime: getDate(1, 10, 30),
    endTime: getDate(1, 11, 30),
    resourceId: 'res-001',
    status: 'conflict',
    price: 150,
    notes: 'CONFLICT: Overlaps with Robert Chen booking',
    createdAt: getDate(-2, 14, 0),
    updatedAt: getDate(0, 8, 0),
  },
  {
    id: 'apt-007',
    customerName: 'James Patel',
    customerEmail: 'james.p@services.co.nz',
    customerPhone: '+64 27 555 6789',
    serviceType: 'Full Service',
    startTime: getDate(1, 9, 0),
    endTime: getDate(1, 11, 0),
    resourceId: 'res-002',
    status: 'confirmed',
    price: 320,
    createdAt: getDate(-4, 10, 30),
    updatedAt: getDate(-4, 10, 30),
  },
  {
    id: 'apt-008',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@retail.co.nz',
    customerPhone: '+64 21 555 0123',
    serviceType: 'Quick Check',
    startTime: getDate(1, 14, 0),
    endTime: getDate(1, 14, 30),
    resourceId: 'res-003',
    status: 'pending',
    price: 75,
    createdAt: getDate(0, 11, 45),
    updatedAt: getDate(0, 11, 45),
  },
  // Day after tomorrow
  {
    id: 'apt-009',
    customerName: 'Michael Brown',
    customerEmail: 'michael.b@enterprise.co.nz',
    customerPhone: '+64 22 555 4567',
    serviceType: 'Premium Package',
    startTime: getDate(2, 9, 30),
    endTime: getDate(2, 11, 30),
    resourceId: 'res-002',
    status: 'confirmed',
    price: 450,
    createdAt: getDate(-6, 16, 0),
    updatedAt: getDate(-6, 16, 0),
  },
  {
    id: 'apt-010',
    customerName: 'Jennifer Lee',
    customerEmail: 'jennifer.l@startup.co.nz',
    customerPhone: '+64 27 555 8901',
    serviceType: 'General Consultation',
    startTime: getDate(2, 13, 0),
    endTime: getDate(2, 14, 0),
    resourceId: 'res-001',
    status: 'confirmed',
    price: 150,
    createdAt: getDate(-3, 9, 15),
    updatedAt: getDate(-3, 9, 15),
  },
  // Cancelled appointment
  {
    id: 'apt-011',
    customerName: 'Kevin Martinez',
    customerEmail: 'kevin.m@agency.co.nz',
    customerPhone: '+64 21 555 2468',
    serviceType: 'Full Service',
    startTime: getDate(2, 15, 0),
    endTime: getDate(2, 17, 0),
    resourceId: 'res-003',
    status: 'cancelled',
    price: 320,
    notes: 'Customer requested cancellation',
    createdAt: getDate(-8, 14, 30),
    updatedAt: getDate(-1, 11, 0),
  },
  // More future appointments
  {
    id: 'apt-012',
    customerName: 'Amanda Taylor',
    customerEmail: 'amanda.t@consulting.co.nz',
    customerPhone: '+64 22 555 1357',
    serviceType: 'Emergency Slot',
    startTime: getDate(3, 8, 0),
    endTime: getDate(3, 9, 0),
    resourceId: 'res-003',
    status: 'confirmed',
    price: 200,
    notes: 'Urgent request - priority customer',
    createdAt: getDate(0, 7, 30),
    updatedAt: getDate(0, 7, 30),
  },
  {
    id: 'apt-013',
    customerName: 'Christopher Davis',
    customerEmail: 'chris.d@finance.co.nz',
    customerPhone: '+64 27 555 9753',
    serviceType: 'Premium Package',
    startTime: getDate(3, 10, 0),
    endTime: getDate(3, 12, 0),
    resourceId: 'res-001',
    status: 'pending',
    price: 450,
    createdAt: getDate(0, 15, 20),
    updatedAt: getDate(0, 15, 20),
  },
  {
    id: 'apt-014',
    customerName: 'Nicole Harris',
    customerEmail: 'nicole.h@design.co.nz',
    customerPhone: '+64 21 555 8642',
    serviceType: 'General Consultation',
    startTime: getDate(4, 11, 0),
    endTime: getDate(4, 12, 0),
    resourceId: 'res-002',
    status: 'confirmed',
    price: 150,
    createdAt: getDate(-2, 13, 0),
    updatedAt: getDate(-2, 13, 0),
  },
];

// Audit Log entries showing AI agent activity
export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: getDate(0, 8, 15),
    triggeredBy: 'ai_agent',
    actionType: 'conflict_detected',
    executionTimeMs: 145,
    generatedTSQL: `SELECT a1.Id, a1.CustomerName, a2.Id AS ConflictId, a2.CustomerName AS ConflictCustomer
FROM Appointments a1
INNER JOIN Appointments a2 ON a1.ResourceId = a2.ResourceId
WHERE a1.Id != a2.Id
  AND a1.StartTime < a2.EndTime
  AND a1.EndTime > a2.StartTime
  AND a1.Status != 'cancelled'
  AND a2.Status != 'cancelled';`,
    affectedRecords: 2,
    success: true,
    metadata: { conflictPair: ['apt-005', 'apt-006'] },
  },
  {
    id: 'log-002',
    timestamp: getDate(0, 8, 30),
    triggeredBy: 'user',
    actionType: 'schedule_create',
    executionTimeMs: 89,
    affectedRecords: 1,
    success: true,
    metadata: { appointmentId: 'apt-012' },
  },
  {
    id: 'log-003',
    timestamp: getDate(-1, 11, 0),
    triggeredBy: 'user',
    actionType: 'schedule_cancel',
    executionTimeMs: 56,
    affectedRecords: 1,
    success: true,
    metadata: { appointmentId: 'apt-011', reason: 'Customer request' },
  },
  {
    id: 'log-004',
    timestamp: getDate(-1, 14, 30),
    triggeredBy: 'ai_agent',
    actionType: 'report_generated',
    executionTimeMs: 234,
    generatedTSQL: `SELECT 
  CAST(StartTime AS DATE) AS BookingDate,
  COUNT(*) AS TotalBookings,
  SUM(Price) AS Revenue,
  AVG(DATEDIFF(MINUTE, StartTime, EndTime)) AS AvgDurationMins
FROM Appointments
WHERE Status IN ('confirmed', 'completed')
  AND StartTime >= DATEADD(DAY, -7, GETDATE())
GROUP BY CAST(StartTime AS DATE)
ORDER BY BookingDate DESC;`,
    affectedRecords: 0,
    success: true,
    metadata: { reportType: 'weekly_summary' },
  },
  {
    id: 'log-005',
    timestamp: getDate(-2, 9, 30),
    triggeredBy: 'ai_agent',
    actionType: 'ai_query_executed',
    executionTimeMs: 312,
    generatedTSQL: `SELECT c.CustomerName, c.Email, 
  COUNT(a.Id) AS VisitCount,
  SUM(a.Price) AS TotalSpend,
  MAX(a.StartTime) AS LastVisit,
  DATEDIFF(DAY, MAX(a.StartTime), GETDATE()) AS DaysSinceLastVisit
FROM Customers c
LEFT JOIN Appointments a ON c.Id = a.CustomerId
WHERE a.Status = 'completed'
GROUP BY c.Id, c.CustomerName, c.Email
HAVING DATEDIFF(DAY, MAX(a.StartTime), GETDATE()) > 60
ORDER BY TotalSpend DESC;`,
    affectedRecords: 5,
    success: true,
    metadata: { queryType: 'churn_risk_analysis' },
  },
];

// Customer insights for AI analysis
export const mockCustomerInsights: CustomerInsight[] = [
  {
    customerId: 'cust-001',
    customerName: 'Global Tech Solutions',
    totalSpend: 4250,
    visitCount: 12,
    lastVisit: getDate(-15, 14, 0),
    daysSinceLastVisit: 15,
    preferredServices: ['Premium Package', 'Full Service'],
    churnRisk: 'low',
    lifetimeValue: 8500,
  },
  {
    customerId: 'cust-002',
    customerName: 'Coastal Enterprises Ltd',
    totalSpend: 2100,
    visitCount: 8,
    lastVisit: getDate(-65, 10, 0),
    daysSinceLastVisit: 65,
    preferredServices: ['General Consultation'],
    churnRisk: 'high',
    lifetimeValue: 3200,
  },
  {
    customerId: 'cust-003',
    customerName: 'Southland Motors',
    totalSpend: 3600,
    visitCount: 15,
    lastVisit: getDate(-72, 11, 30),
    daysSinceLastVisit: 72,
    preferredServices: ['Full Service', 'Quick Check'],
    churnRisk: 'high',
    lifetimeValue: 5400,
  },
  {
    customerId: 'cust-004',
    customerName: 'Peak Performance NZ',
    totalSpend: 1850,
    visitCount: 6,
    lastVisit: getDate(-45, 9, 0),
    daysSinceLastVisit: 45,
    preferredServices: ['General Consultation', 'Premium Package'],
    churnRisk: 'medium',
    lifetimeValue: 2800,
  },
  {
    customerId: 'cust-005',
    customerName: 'Innovation Hub Invercargill',
    totalSpend: 5200,
    visitCount: 18,
    lastVisit: getDate(-8, 15, 0),
    daysSinceLastVisit: 8,
    preferredServices: ['Premium Package', 'Emergency Slot'],
    churnRisk: 'low',
    lifetimeValue: 9500,
  },
];

// Revenue metrics for forecasting
export const mockRevenueMetrics: RevenueMetrics[] = [
  {
    date: getDate(0, 0, 0),
    totalRevenue: 995,
    projectedRevenue: 1200,
    utilizationRate: 0.65,
    averageBookingValue: 248.75,
    unutilizedSlots: 14,
    potentialRevenueLoss: 525,
  },
  {
    date: getDate(1, 0, 0),
    totalRevenue: 1145,
    projectedRevenue: 1400,
    utilizationRate: 0.72,
    averageBookingValue: 286.25,
    unutilizedSlots: 11,
    potentialRevenueLoss: 412.50,
  },
  {
    date: getDate(2, 0, 0),
    totalRevenue: 920,
    projectedRevenue: 1350,
    utilizationRate: 0.58,
    averageBookingValue: 306.67,
    unutilizedSlots: 17,
    potentialRevenueLoss: 637.50,
  },
];

// Format helpers
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-NZ', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-NZ', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    conflict: 'bg-red-500/20 text-red-400 border-red-500/30',
    cancelled: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return colors[status] || colors.pending;
};
