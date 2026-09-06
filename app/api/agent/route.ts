// ============================================
// BookingTimes Portfolio - AI Agent API Route
// Author: Tumara Hall | CB Tech Trust
// Simulates agentic AI with tool-calling patterns
// ============================================

import { NextRequest, NextResponse } from 'next/server';

interface AgentTool {
  name: string;
  description: string;
  execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

interface ToolResult {
  success: boolean;
  data: unknown;
  executionTimeMs: number;
  generatedSQL?: string;
}

interface AgentThought {
  type: 'thinking' | 'executing' | 'validating' | 'result';
  content: string;
  timestamp: string;
  toolUsed?: string;
  executionTimeMs?: number;
}

// Simulated delay to make it feel realistic
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Tool definitions
const tools: Record<string, AgentTool> = {
  getScheduleConflicts: {
    name: 'getScheduleConflicts',
    description: 'Detects scheduling conflicts for a given date',
    execute: async (params) => {
      await simulateDelay(150);
      return {
        success: true,
        executionTimeMs: 145,
        generatedSQL: `EXEC usp_DetectScheduleConflicts @StartDate = '${params.date}', @EndDate = DATEADD(DAY, 1, '${params.date}')`,
        data: {
          conflicts: [
            {
              id: 'conflict-001',
              severity: 'HIGH',
              appointment1: { customer: 'Robert Chen', service: 'Premium Package', time: '10:00 AM - 12:00 PM' },
              appointment2: { customer: 'Lisa Anderson', service: 'General Consultation', time: '10:30 AM - 11:30 AM' },
              resource: 'Dr. Sarah Mitchell',
              overlapMinutes: 90,
              suggestedResolution: 'Move Lisa Anderson to 1:00 PM with Emily Parker (available)'
            }
          ],
          totalConflicts: 1,
          resourcesAffected: 1
        }
      };
    }
  },
  generateTSQLReport: {
    name: 'generateTSQLReport',
    description: 'Generates analytical SQL reports',
    execute: async (params) => {
      await simulateDelay(200);
      const reportTypes: Record<string, unknown> = {
        revenue_forecast: {
          summary: 'Weekly Revenue Forecast Analysis',
          data: [
            { date: 'Today', booked: '$995', potential: '$1,520', utilization: '65%' },
            { date: 'Tomorrow', booked: '$1,145', potential: '$1,557', utilization: '72%' },
            { date: 'Day 3', booked: '$920', potential: '$1,557', utilization: '58%' },
          ],
          insights: [
            'Afternoon slots (2-5 PM) are 40% underutilized',
            'Premium Package services drive 45% of revenue',
            'Thursday has lowest utilization at 52%'
          ],
          recommendation: 'Consider promotional pricing for afternoon slots to boost utilization'
        },
        utilization: {
          summary: 'Resource Utilization Report',
          data: [
            { resource: 'Dr. Sarah Mitchell', utilization: '78%', revenue: '$2,850' },
            { resource: 'James Wong', utilization: '85%', revenue: '$2,240' },
            { resource: 'Emily Parker', utilization: '62%', revenue: '$1,680' },
          ],
          recommendation: 'Emily Parker has capacity for 6 additional appointments this week'
        },
        churn_risk: {
          summary: 'Customer Churn Risk Analysis',
          data: [
            { customer: 'Coastal Enterprises Ltd', lastVisit: '65 days ago', totalSpend: '$2,100', risk: 'HIGH' },
            { customer: 'Southland Motors', lastVisit: '72 days ago', totalSpend: '$3,600', risk: 'HIGH' },
            { customer: 'Peak Performance NZ', lastVisit: '45 days ago', totalSpend: '$1,850', risk: 'MEDIUM' },
          ],
          recommendation: 'Prioritize outreach to high-value churning customers - potential revenue at risk: $5,700'
        }
      };
      
      return {
        success: true,
        executionTimeMs: 234,
        generatedSQL: `-- ${params.queryType} Report\nSELECT * FROM vw_${params.queryType}_analysis WHERE ReportDate >= GETDATE()`,
        data: reportTypes[params.queryType as string] || reportTypes.revenue_forecast
      };
    }
  },
  rescheduleAppointment: {
    name: 'rescheduleAppointment',
    description: 'Reschedules an appointment to a new time slot',
    execute: async (params) => {
      await simulateDelay(100);
      return {
        success: true,
        executionTimeMs: 89,
        generatedSQL: `EXEC usp_RescheduleAppointment @AppointmentId = '${params.appointmentId}', @NewStartTime = '${params.newTime}'`,
        data: {
          message: 'Appointment rescheduled successfully',
          oldTime: '10:30 AM - 11:30 AM',
          newTime: params.newTime,
          customer: 'Lisa Anderson',
          requiresConfirmation: true
        }
      };
    }
  }
};

// Process user query and determine which tools to use
async function processQuery(query: string): Promise<{
  thoughts: AgentThought[];
  result: {
    success: boolean;
    summary: string;
    data?: unknown;
    actions?: Array<{ id: string; label: string; type: string; action: string }>;
  };
  totalExecutionTimeMs: number;
}> {
  const thoughts: AgentThought[] = [];
  const startTime = Date.now();
  
  // Determine query intent
  const queryLower = query.toLowerCase();
  
  // Thinking phase
  thoughts.push({
    type: 'thinking',
    content: `Analyzing query: "${query.slice(0, 50)}..."`,
    timestamp: new Date().toISOString()
  });
  
  await simulateDelay(100);
  
  if (queryLower.includes('double-book') || queryLower.includes('conflict')) {
    thoughts.push({
      type: 'thinking',
      content: 'Detected conflict analysis intent. Planning to use getScheduleConflicts tool.',
      timestamp: new Date().toISOString()
    });
    
    thoughts.push({
      type: 'executing',
      content: 'Executing T-SQL stored procedure usp_DetectScheduleConflicts...',
      timestamp: new Date().toISOString(),
      toolUsed: 'getScheduleConflicts'
    });
    
    const result = await tools.getScheduleConflicts.execute({ date: new Date().toISOString().split('T')[0] });
    
    thoughts.push({
      type: 'validating',
      content: `Query completed in ${result.executionTimeMs}ms. Validating results against schema...`,
      timestamp: new Date().toISOString(),
      executionTimeMs: result.executionTimeMs
    });
    
    thoughts.push({
      type: 'result',
      content: 'Analysis complete. Found 1 scheduling conflict requiring attention.',
      timestamp: new Date().toISOString()
    });
    
    return {
      thoughts,
      result: {
        success: true,
        summary: `Found 1 scheduling conflict for tomorrow. Robert Chen (Premium Package) and Lisa Anderson (General Consultation) are double-booked with Dr. Sarah Mitchell from 10:30-11:30 AM.`,
        data: result.data,
        actions: [
          { id: 'resolve-1', label: 'Move Lisa to 1:00 PM', type: 'primary', action: 'reschedule' },
          { id: 'resolve-2', label: 'Assign to Emily Parker', type: 'secondary', action: 'reassign' },
          { id: 'notify', label: 'Notify Both Customers', type: 'secondary', action: 'notify' }
        ]
      },
      totalExecutionTimeMs: Date.now() - startTime
    };
  }
  
  if (queryLower.includes('revenue') || queryLower.includes('forecast') || queryLower.includes('afternoon')) {
    thoughts.push({
      type: 'thinking',
      content: 'Detected revenue/utilization analysis intent. Will generate forecast report.',
      timestamp: new Date().toISOString()
    });
    
    thoughts.push({
      type: 'executing',
      content: 'Running analytical query against booking data with window functions...',
      timestamp: new Date().toISOString(),
      toolUsed: 'generateTSQLReport'
    });
    
    const result = await tools.generateTSQLReport.execute({ queryType: 'revenue_forecast' });
    
    thoughts.push({
      type: 'validating',
      content: `Report generated in ${result.executionTimeMs}ms. Cross-referencing with capacity data...`,
      timestamp: new Date().toISOString(),
      executionTimeMs: result.executionTimeMs
    });
    
    thoughts.push({
      type: 'result',
      content: 'Revenue forecast complete with utilization insights.',
      timestamp: new Date().toISOString()
    });
    
    return {
      thoughts,
      result: {
        success: true,
        summary: 'Afternoon slots (2-5 PM) show 40% underutilization. Potential additional revenue of $637.50 this week from unfilled slots. Premium Package services are your top revenue driver at 45%.',
        data: result.data,
        actions: [
          { id: 'promo', label: 'Create Afternoon Promo', type: 'primary', action: 'create_promotion' },
          { id: 'export', label: 'Export Full Report', type: 'secondary', action: 'export' }
        ]
      },
      totalExecutionTimeMs: Date.now() - startTime
    };
  }
  
  if (queryLower.includes('customer') || queryLower.includes('rebook') || queryLower.includes('60 days') || queryLower.includes('churn')) {
    thoughts.push({
      type: 'thinking',
      content: 'Detected customer retention/churn analysis intent.',
      timestamp: new Date().toISOString()
    });
    
    thoughts.push({
      type: 'executing',
      content: 'Querying customer engagement metrics and calculating churn risk scores...',
      timestamp: new Date().toISOString(),
      toolUsed: 'generateTSQLReport'
    });
    
    const result = await tools.generateTSQLReport.execute({ queryType: 'churn_risk' });
    
    thoughts.push({
      type: 'validating',
      content: `Analysis completed in ${result.executionTimeMs}ms. Ranking by lifetime value and risk level...`,
      timestamp: new Date().toISOString(),
      executionTimeMs: result.executionTimeMs
    });
    
    thoughts.push({
      type: 'result',
      content: 'Customer churn analysis complete with prioritized outreach list.',
      timestamp: new Date().toISOString()
    });
    
    return {
      thoughts,
      result: {
        success: true,
        summary: 'Found 3 high-value customers who haven\'t rebooked in 60+ days. Combined historical spend: $7,550. Southland Motors (72 days, $3,600) and Coastal Enterprises (65 days, $2,100) are highest priority.',
        data: result.data,
        actions: [
          { id: 'email', label: 'Send Re-engagement Emails', type: 'primary', action: 'send_campaign' },
          { id: 'call', label: 'Generate Call List', type: 'secondary', action: 'export_contacts' },
          { id: 'offer', label: 'Create Loyalty Offer', type: 'secondary', action: 'create_offer' }
        ]
      },
      totalExecutionTimeMs: Date.now() - startTime
    };
  }
  
  // Default response
  thoughts.push({
    type: 'thinking',
    content: 'Processing general inquiry. Analyzing available context...',
    timestamp: new Date().toISOString()
  });
  
  return {
    thoughts,
    result: {
      success: true,
      summary: 'I can help you analyze scheduling conflicts, forecast revenue from unused slots, or identify customers at risk of churning. Try one of the suggested prompts!',
      actions: []
    },
    totalExecutionTimeMs: Date.now() - startTime
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    const response = await processQuery(query);
    
    return NextResponse.json({
      id: crypto.randomUUID(),
      query,
      ...response
    });
    
  } catch (error) {
    console.error('Agent API error:', error);
    return NextResponse.json(
      { error: 'Failed to process agent query' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '1.0.0',
    tools: Object.keys(tools),
    description: 'BookingTimes AI Agent API - Tumara Hall Portfolio Demo'
  });
}
