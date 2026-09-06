// ============================================
// BookingTimes Portfolio Showcase - Code Snippets
// Author: Tumara Hall | CB Tech Trust
// Demonstrates: C# / ASP.NET Core & T-SQL Expertise
// ============================================

export interface CodeSnippet {
  id: string;
  title: string;
  language: 'csharp' | 'sql' | 'typescript';
  description: string;
  code: string;
  highlights: string[];
}

export const csharpSnippets: CodeSnippet[] = [
  {
    id: 'cs-001',
    title: 'AppointmentController.cs - Conflict Detection Endpoint',
    language: 'csharp',
    description: 'ASP.NET Core Web API endpoint demonstrating dependency injection, async patterns, and LINQ queries for detecting scheduling conflicts.',
    highlights: [
      'Dependency Injection with IAppointmentService',
      'Async/await pattern with CancellationToken',
      'ActionResult<T> for type-safe responses',
      'ILogger for structured logging',
    ],
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BookingTimes.Services;
using BookingTimes.Models;

namespace BookingTimes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IConflictDetectionService _conflictService;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(
            IAppointmentService appointmentService,
            IConflictDetectionService conflictService,
            ILogger<AppointmentController> logger)
        {
            _appointmentService = appointmentService;
            _conflictService = conflictService;
            _logger = logger;
        }

        /// <summary>
        /// Detects scheduling conflicts for a given date range and resource.
        /// </summary>
        [HttpGet("conflicts")]
        [ProducesResponseType(typeof(IEnumerable<ConflictResult>), 200)]
        [ProducesResponseType(400)]
        public async Task<ActionResult<IEnumerable<ConflictResult>>> GetConflicts(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate,
            [FromQuery] string? resourceId = null,
            CancellationToken cancellationToken = default)
        {
            if (startDate >= endDate)
            {
                _logger.LogWarning(
                    "Invalid date range: {StartDate} to {EndDate}", 
                    startDate, endDate);
                return BadRequest("Start date must be before end date.");
            }

            try
            {
                var conflicts = await _conflictService
                    .DetectConflictsAsync(startDate, endDate, resourceId, cancellationToken);

                _logger.LogInformation(
                    "Found {ConflictCount} conflicts between {StartDate} and {EndDate}",
                    conflicts.Count(), startDate, endDate);

                return Ok(conflicts);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Conflict detection cancelled by client.");
                return StatusCode(499, "Request cancelled.");
            }
        }

        /// <summary>
        /// Reschedules an appointment with conflict validation.
        /// </summary>
        [HttpPut("{appointmentId}/reschedule")]
        [ProducesResponseType(typeof(AppointmentDto), 200)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<AppointmentDto>> RescheduleAppointment(
            Guid appointmentId,
            [FromBody] RescheduleRequest request,
            CancellationToken cancellationToken = default)
        {
            // Validate new time slot doesn't create conflicts
            var potentialConflicts = await _conflictService
                .CheckSlotAvailabilityAsync(
                    request.NewStartTime,
                    request.NewEndTime,
                    request.ResourceId,
                    excludeAppointmentId: appointmentId,
                    cancellationToken);

            if (potentialConflicts.Any())
            {
                _logger.LogWarning(
                    "Reschedule blocked: {ConflictCount} conflicts detected for {AppointmentId}",
                    potentialConflicts.Count(), appointmentId);

                return Conflict(new
                {
                    Message = "Rescheduling would create conflicts.",
                    Conflicts = potentialConflicts
                });
            }

            var result = await _appointmentService
                .RescheduleAsync(appointmentId, request, cancellationToken);

            return Ok(result);
        }
    }
}`,
  },
  {
    id: 'cs-002',
    title: 'ConflictDetectionService.cs - Business Logic Layer',
    language: 'csharp',
    description: 'Service layer implementing complex scheduling conflict detection using LINQ and Entity Framework Core.',
    highlights: [
      'Entity Framework Core with async queries',
      'LINQ expressions for overlap detection',
      'Business logic encapsulation',
      'IQueryable for deferred execution',
    ],
    code: `using Microsoft.EntityFrameworkCore;
using BookingTimes.Data;
using BookingTimes.Models;

namespace BookingTimes.Services
{
    public class ConflictDetectionService : IConflictDetectionService
    {
        private readonly BookingDbContext _context;

        public ConflictDetectionService(BookingDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ConflictResult>> DetectConflictsAsync(
            DateTime startDate,
            DateTime endDate,
            string? resourceId,
            CancellationToken cancellationToken)
        {
            // Build base query for appointments in range
            IQueryable<Appointment> query = _context.Appointments
                .Where(a => a.StartTime < endDate && a.EndTime > startDate)
                .Where(a => a.Status != AppointmentStatus.Cancelled);

            if (!string.IsNullOrEmpty(resourceId))
            {
                query = query.Where(a => a.ResourceId == resourceId);
            }

            var appointments = await query
                .Include(a => a.Resource)
                .Include(a => a.Customer)
                .OrderBy(a => a.ResourceId)
                .ThenBy(a => a.StartTime)
                .ToListAsync(cancellationToken);

            // Detect overlapping appointments per resource
            var conflicts = new List<ConflictResult>();
            var groupedByResource = appointments.GroupBy(a => a.ResourceId);

            foreach (var resourceGroup in groupedByResource)
            {
                var resourceAppointments = resourceGroup.ToList();

                for (int i = 0; i < resourceAppointments.Count; i++)
                {
                    for (int j = i + 1; j < resourceAppointments.Count; j++)
                    {
                        var a1 = resourceAppointments[i];
                        var a2 = resourceAppointments[j];

                        // Check for time overlap
                        if (a1.StartTime < a2.EndTime && a1.EndTime > a2.StartTime)
                        {
                            conflicts.Add(new ConflictResult
                            {
                                ConflictId = Guid.NewGuid(),
                                Appointment1 = MapToDto(a1),
                                Appointment2 = MapToDto(a2),
                                OverlapStart = Max(a1.StartTime, a2.StartTime),
                                OverlapEnd = Min(a1.EndTime, a2.EndTime),
                                Severity = CalculateSeverity(a1, a2),
                                SuggestedResolutions = GenerateResolutions(a1, a2)
                            });
                        }
                    }
                }
            }

            return conflicts;
        }

        private ConflictSeverity CalculateSeverity(Appointment a1, Appointment a2)
        {
            var overlapMinutes = (Min(a1.EndTime, a2.EndTime) - Max(a1.StartTime, a2.StartTime)).TotalMinutes;
            var avgDuration = ((a1.EndTime - a1.StartTime) + (a2.EndTime - a2.StartTime)).TotalMinutes / 2;
            var overlapRatio = overlapMinutes / avgDuration;

            return overlapRatio switch
            {
                > 0.75 => ConflictSeverity.High,
                > 0.25 => ConflictSeverity.Medium,
                _ => ConflictSeverity.Low
            };
        }

        private static DateTime Max(DateTime a, DateTime b) => a > b ? a : b;
        private static DateTime Min(DateTime a, DateTime b) => a < b ? a : b;
    }
}`,
  },
];

export const sqlSnippets: CodeSnippet[] = [
  {
    id: 'sql-001',
    title: 'usp_DetectScheduleConflicts - Conflict Detection Procedure',
    language: 'sql',
    description: 'Production-grade stored procedure with explicit transactions, error handling, and locking hints for safe concurrent access.',
    highlights: [
      'Explicit BEGIN TRAN / COMMIT / ROLLBACK',
      'TRY...CATCH error handling pattern',
      'Locking hints (UPDLOCK, HOLDLOCK)',
      'Output parameters for result metadata',
    ],
    code: `-- ============================================
-- Stored Procedure: usp_DetectScheduleConflicts
-- Purpose: Detect overlapping appointments with 
--          transaction-safe conflict resolution
-- Author: Tumara Hall | BookingTimes Demo
-- ============================================

CREATE OR ALTER PROCEDURE [dbo].[usp_DetectScheduleConflicts]
    @StartDate DATETIME2,
    @EndDate DATETIME2,
    @ResourceId NVARCHAR(50) = NULL,
    @ConflictCount INT OUTPUT,
    @ExecutionTimeMs INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    
    DECLARE @StartTime DATETIME2 = SYSDATETIME();
    DECLARE @ErrorMessage NVARCHAR(4000);
    DECLARE @ErrorSeverity INT;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Create temp table for conflict results
        CREATE TABLE #Conflicts (
            ConflictId UNIQUEIDENTIFIER DEFAULT NEWID(),
            Appointment1Id UNIQUEIDENTIFIER NOT NULL,
            Appointment2Id UNIQUEIDENTIFIER NOT NULL,
            ResourceId NVARCHAR(50) NOT NULL,
            OverlapStartTime DATETIME2 NOT NULL,
            OverlapEndTime DATETIME2 NOT NULL,
            OverlapMinutes INT NOT NULL,
            Severity NVARCHAR(20) NOT NULL,
            DetectedAt DATETIME2 DEFAULT SYSDATETIME()
        );
        
        -- Detect overlapping appointments with row-level locks
        -- to prevent phantom reads during conflict detection
        INSERT INTO #Conflicts (
            Appointment1Id, 
            Appointment2Id, 
            ResourceId,
            OverlapStartTime, 
            OverlapEndTime, 
            OverlapMinutes,
            Severity
        )
        SELECT 
            a1.Id AS Appointment1Id,
            a2.Id AS Appointment2Id,
            a1.ResourceId,
            CASE WHEN a1.StartTime > a2.StartTime 
                 THEN a1.StartTime ELSE a2.StartTime END AS OverlapStart,
            CASE WHEN a1.EndTime < a2.EndTime 
                 THEN a1.EndTime ELSE a2.EndTime END AS OverlapEnd,
            DATEDIFF(MINUTE, 
                CASE WHEN a1.StartTime > a2.StartTime 
                     THEN a1.StartTime ELSE a2.StartTime END,
                CASE WHEN a1.EndTime < a2.EndTime 
                     THEN a1.EndTime ELSE a2.EndTime END
            ) AS OverlapMinutes,
            CASE 
                WHEN DATEDIFF(MINUTE, 
                    CASE WHEN a1.StartTime > a2.StartTime 
                         THEN a1.StartTime ELSE a2.StartTime END,
                    CASE WHEN a1.EndTime < a2.EndTime 
                         THEN a1.EndTime ELSE a2.EndTime END) > 45 
                THEN 'HIGH'
                WHEN DATEDIFF(MINUTE, 
                    CASE WHEN a1.StartTime > a2.StartTime 
                         THEN a1.StartTime ELSE a2.StartTime END,
                    CASE WHEN a1.EndTime < a2.EndTime 
                         THEN a1.EndTime ELSE a2.EndTime END) > 15 
                THEN 'MEDIUM'
                ELSE 'LOW'
            END AS Severity
        FROM Appointments a1 WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN Appointments a2 WITH (UPDLOCK, HOLDLOCK)
            ON a1.ResourceId = a2.ResourceId
            AND a1.Id < a2.Id  -- Prevent duplicate pairs
            AND a1.StartTime < a2.EndTime
            AND a1.EndTime > a2.StartTime
        WHERE a1.Status NOT IN ('Cancelled', 'Completed')
          AND a2.Status NOT IN ('Cancelled', 'Completed')
          AND a1.StartTime < @EndDate
          AND a1.EndTime > @StartDate
          AND (@ResourceId IS NULL OR a1.ResourceId = @ResourceId);
        
        -- Log conflicts to audit table
        INSERT INTO AuditLog (
            Timestamp, TriggeredBy, ActionType, 
            AffectedRecords, Success, GeneratedTSQL
        )
        SELECT 
            SYSDATETIME(),
            'SYSTEM',
            'CONFLICT_DETECTED',
            COUNT(*),
            1,
            'usp_DetectScheduleConflicts'
        FROM #Conflicts;
        
        SET @ConflictCount = @@ROWCOUNT;
        
        -- Return conflict details with appointment info
        SELECT 
            c.ConflictId,
            c.Severity,
            c.OverlapStartTime,
            c.OverlapEndTime,
            c.OverlapMinutes,
            a1.CustomerName AS Customer1,
            a1.ServiceType AS Service1,
            a2.CustomerName AS Customer2,
            a2.ServiceType AS Service2,
            r.Name AS ResourceName
        FROM #Conflicts c
        INNER JOIN Appointments a1 ON c.Appointment1Id = a1.Id
        INNER JOIN Appointments a2 ON c.Appointment2Id = a2.Id
        INNER JOIN Resources r ON c.ResourceId = r.Id
        ORDER BY c.Severity DESC, c.OverlapMinutes DESC;
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @ErrorMessage = ERROR_MESSAGE();
        SET @ErrorSeverity = ERROR_SEVERITY();
        
        -- Log error to audit
        INSERT INTO AuditLog (
            Timestamp, TriggeredBy, ActionType, 
            Success, ErrorMessage
        )
        VALUES (
            SYSDATETIME(), 'SYSTEM', 'CONFLICT_DETECTED',
            0, @ErrorMessage
        );
        
        THROW;
    END CATCH;
    
    SET @ExecutionTimeMs = DATEDIFF(MILLISECOND, @StartTime, SYSDATETIME());
END;
GO`,
  },
  {
    id: 'sql-002',
    title: 'usp_RescheduleAppointment - Safe Rescheduling with Validation',
    language: 'sql',
    description: 'Stored procedure for rescheduling appointments with pre-validation conflict checks and atomic updates.',
    highlights: [
      'Pre-validation before mutation',
      'SERIALIZABLE isolation for safety',
      'Audit trail logging',
      'Optimistic concurrency with RowVersion',
    ],
    code: `-- ============================================
-- Stored Procedure: usp_RescheduleAppointment
-- Purpose: Safely reschedule with conflict validation
-- Author: Tumara Hall | BookingTimes Demo
-- ============================================

CREATE OR ALTER PROCEDURE [dbo].[usp_RescheduleAppointment]
    @AppointmentId UNIQUEIDENTIFIER,
    @NewStartTime DATETIME2,
    @NewEndTime DATETIME2,
    @NewResourceId NVARCHAR(50) = NULL,
    @ModifiedBy NVARCHAR(100),
    @Success BIT OUTPUT,
    @Message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    
    DECLARE @OldStartTime DATETIME2;
    DECLARE @OldEndTime DATETIME2;
    DECLARE @OldResourceId NVARCHAR(50);
    DECLARE @ConflictExists BIT = 0;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Fetch current appointment with exclusive lock
        SELECT 
            @OldStartTime = StartTime,
            @OldEndTime = EndTime,
            @OldResourceId = ResourceId
        FROM Appointments WITH (XLOCK, ROWLOCK)
        WHERE Id = @AppointmentId
          AND Status NOT IN ('Cancelled', 'Completed');
        
        IF @OldStartTime IS NULL
        BEGIN
            SET @Success = 0;
            SET @Message = 'Appointment not found or not modifiable.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Use existing resource if not specified
        SET @NewResourceId = ISNULL(@NewResourceId, @OldResourceId);
        
        -- Validate new time slot for conflicts
        IF EXISTS (
            SELECT 1
            FROM Appointments WITH (HOLDLOCK)
            WHERE ResourceId = @NewResourceId
              AND Id != @AppointmentId
              AND Status NOT IN ('Cancelled', 'Completed')
              AND StartTime < @NewEndTime
              AND EndTime > @NewStartTime
        )
        BEGIN
            SET @ConflictExists = 1;
            SET @Success = 0;
            SET @Message = 'New time slot conflicts with existing booking.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Perform the reschedule
        UPDATE Appointments
        SET StartTime = @NewStartTime,
            EndTime = @NewEndTime,
            ResourceId = @NewResourceId,
            UpdatedAt = SYSDATETIME(),
            ModifiedBy = @ModifiedBy
        WHERE Id = @AppointmentId;
        
        -- Create audit entry
        INSERT INTO AuditLog (
            Timestamp,
            TriggeredBy,
            ActionType,
            AffectedRecords,
            Success,
            Metadata
        )
        VALUES (
            SYSDATETIME(),
            @ModifiedBy,
            'SCHEDULE_UPDATE',
            1,
            1,
            JSON_OBJECT(
                'appointmentId': CAST(@AppointmentId AS NVARCHAR(50)),
                'oldStart': FORMAT(@OldStartTime, 'yyyy-MM-dd HH:mm'),
                'oldEnd': FORMAT(@OldEndTime, 'yyyy-MM-dd HH:mm'),
                'newStart': FORMAT(@NewStartTime, 'yyyy-MM-dd HH:mm'),
                'newEnd': FORMAT(@NewEndTime, 'yyyy-MM-dd HH:mm')
            )
        );
        
        COMMIT TRANSACTION;
        
        SET @Success = 1;
        SET @Message = 'Appointment rescheduled successfully.';
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @Success = 0;
        SET @Message = ERROR_MESSAGE();
        
        INSERT INTO AuditLog (
            Timestamp, TriggeredBy, ActionType, 
            Success, ErrorMessage
        )
        VALUES (
            SYSDATETIME(), @ModifiedBy, 'SCHEDULE_UPDATE',
            0, ERROR_MESSAGE()
        );
    END CATCH;
END;
GO`,
  },
  {
    id: 'sql-003',
    title: 'Revenue Forecasting Query - Analytics',
    language: 'sql',
    description: 'Complex analytical query for revenue forecasting with window functions and CTE patterns.',
    highlights: [
      'Common Table Expressions (CTEs)',
      'Window functions (LAG, SUM OVER)',
      'Date dimension analysis',
      'Utilization calculations',
    ],
    code: `-- ============================================
-- Revenue Forecasting & Utilization Analysis
-- Purpose: Project revenue from unused slots
-- Author: Tumara Hall | BookingTimes Demo
-- ============================================

WITH DateRange AS (
    SELECT CAST(GETDATE() AS DATE) AS ReportDate
    UNION ALL
    SELECT DATEADD(DAY, 1, ReportDate)
    FROM DateRange
    WHERE ReportDate < DATEADD(DAY, 6, CAST(GETDATE() AS DATE))
),
DailyCapacity AS (
    SELECT 
        d.ReportDate,
        r.Id AS ResourceId,
        r.Name AS ResourceName,
        r.Capacity AS DailySlots,
        -- Each slot represents 30 minutes, 8 hours = 16 slots
        16 AS TotalPossibleSlots
    FROM DateRange d
    CROSS JOIN Resources r
    WHERE r.IsActive = 1
),
BookedSlots AS (
    SELECT 
        CAST(a.StartTime AS DATE) AS BookingDate,
        a.ResourceId,
        COUNT(*) AS BookedCount,
        SUM(a.Price) AS BookedRevenue,
        AVG(a.Price) AS AvgBookingValue
    FROM Appointments a
    WHERE a.Status IN ('Confirmed', 'Pending')
      AND a.StartTime >= CAST(GETDATE() AS DATE)
      AND a.StartTime < DATEADD(DAY, 7, CAST(GETDATE() AS DATE))
    GROUP BY CAST(a.StartTime AS DATE), a.ResourceId
),
UtilizationMetrics AS (
    SELECT 
        dc.ReportDate,
        dc.ResourceId,
        dc.ResourceName,
        dc.TotalPossibleSlots,
        ISNULL(bs.BookedCount, 0) AS BookedSlots,
        dc.TotalPossibleSlots - ISNULL(bs.BookedCount, 0) AS AvailableSlots,
        ISNULL(bs.BookedRevenue, 0) AS ActualRevenue,
        ISNULL(bs.AvgBookingValue, 150.00) AS AvgValue,
        -- Calculate utilization percentage
        CAST(ISNULL(bs.BookedCount, 0) AS DECIMAL(5,2)) / 
            dc.TotalPossibleSlots * 100 AS UtilizationPct
    FROM DailyCapacity dc
    LEFT JOIN BookedSlots bs 
        ON dc.ReportDate = bs.BookingDate 
        AND dc.ResourceId = bs.ResourceId
)
SELECT 
    ReportDate,
    ResourceName,
    BookedSlots,
    AvailableSlots,
    CAST(UtilizationPct AS DECIMAL(5,1)) AS [Utilization %],
    ActualRevenue AS [Booked Revenue],
    -- Project potential revenue from unused slots
    AvailableSlots * AvgValue AS [Potential Revenue],
    ActualRevenue + (AvailableSlots * AvgValue) AS [Max Possible Revenue],
    -- Week-over-week comparison using window function
    LAG(ActualRevenue, 7) OVER (
        PARTITION BY ResourceId 
        ORDER BY ReportDate
    ) AS [Same Day Last Week],
    -- Running total for the week
    SUM(ActualRevenue) OVER (
        PARTITION BY ResourceId 
        ORDER BY ReportDate 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS [Running Weekly Total]
FROM UtilizationMetrics
ORDER BY ReportDate, ResourceName
OPTION (MAXRECURSION 7);`,
  },
];

export const aiSafetySnippet: CodeSnippet = {
  id: 'ai-001',
  title: 'AI Agent Safety Layer - Human-in-the-Loop Validation',
  language: 'typescript',
  description: 'Demonstrates schema validation and confirmation gates before AI-generated SQL execution.',
  highlights: [
    'Zod schema validation for AI outputs',
    'Human-in-the-loop confirmation gate',
    'SQL injection prevention',
    'Audit logging for AI actions',
  ],
  code: `// ============================================
// AI Agent Safety Layer
// Purpose: Validate and gate AI-generated mutations
// Author: Tumara Hall | CB Tech Trust
// ============================================

import { z } from 'zod';

// Schema for AI-generated reschedule commands
const RescheduleCommandSchema = z.object({
  action: z.literal('reschedule'),
  appointmentId: z.string().uuid(),
  newStartTime: z.string().datetime(),
  newEndTime: z.string().datetime(),
  resourceId: z.string().optional(),
  reasoning: z.string().min(10).max(500),
});

// Schema for AI-generated SQL queries (read-only)
const SafeQuerySchema = z.object({
  action: z.literal('query'),
  queryType: z.enum([
    'conflicts', 
    'revenue_forecast', 
    'utilization',
    'customer_insights'
  ]),
  parameters: z.record(z.string()).optional(),
});

type AICommand = z.infer<typeof RescheduleCommandSchema> | z.infer<typeof SafeQuerySchema>;

interface SafetyGateResult {
  approved: boolean;
  requiresConfirmation: boolean;
  validationErrors: string[];
  sanitizedCommand?: AICommand;
  auditLogId: string;
}

export async function validateAICommand(
  rawCommand: unknown,
  userId: string
): Promise<SafetyGateResult> {
  const auditLogId = crypto.randomUUID();
  const validationErrors: string[] = [];

  // Step 1: Schema validation
  const rescheduleResult = RescheduleCommandSchema.safeParse(rawCommand);
  const queryResult = SafeQuerySchema.safeParse(rawCommand);

  if (!rescheduleResult.success && !queryResult.success) {
    await logAuditEvent({
      id: auditLogId,
      action: 'AI_COMMAND_REJECTED',
      reason: 'Schema validation failed',
      rawInput: JSON.stringify(rawCommand).slice(0, 1000),
      userId,
    });

    return {
      approved: false,
      requiresConfirmation: false,
      validationErrors: ['Invalid command structure'],
      auditLogId,
    };
  }

  const command = rescheduleResult.success 
    ? rescheduleResult.data 
    : queryResult.data!;

  // Step 2: Mutation commands require human confirmation
  if (command.action === 'reschedule') {
    await logAuditEvent({
      id: auditLogId,
      action: 'AI_COMMAND_PENDING_CONFIRMATION',
      command: command,
      userId,
    });

    return {
      approved: false,
      requiresConfirmation: true,
      validationErrors: [],
      sanitizedCommand: command,
      auditLogId,
    };
  }

  // Step 3: Read-only queries can proceed automatically
  await logAuditEvent({
    id: auditLogId,
    action: 'AI_QUERY_APPROVED',
    command: command,
    userId,
  });

  return {
    approved: true,
    requiresConfirmation: false,
    validationErrors: [],
    sanitizedCommand: command,
    auditLogId,
  };
}

// Parameterized query builder - prevents SQL injection
export function buildSafeQuery(
  queryType: string,
  parameters: Record<string, string>
): { sql: string; params: unknown[] } {
  const queries: Record<string, { sql: string; paramKeys: string[] }> = {
    conflicts: {
      sql: \`
        EXEC usp_DetectScheduleConflicts 
          @StartDate = @p0, 
          @EndDate = @p1, 
          @ResourceId = @p2
      \`,
      paramKeys: ['startDate', 'endDate', 'resourceId'],
    },
    revenue_forecast: {
      sql: \`
        SELECT * FROM vw_RevenueForecast
        WHERE ReportDate BETWEEN @p0 AND @p1
      \`,
      paramKeys: ['startDate', 'endDate'],
    },
  };

  const queryDef = queries[queryType];
  if (!queryDef) {
    throw new Error(\`Unknown query type: \${queryType}\`);
  }

  const params = queryDef.paramKeys.map(key => parameters[key] ?? null);
  return { sql: queryDef.sql, params };
}`,
};

export const allSnippets: CodeSnippet[] = [
  ...csharpSnippets,
  ...sqlSnippets,
  aiSafetySnippet,
];
