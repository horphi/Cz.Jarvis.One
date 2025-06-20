export type TAuditLog = {
  id: number;
  userId?: number | null;
  userName?: string | null;
  impersonatorTenantId?: number | null;
  impersonatorUserId?: number | null;
  serviceName?: string | null;
  methodName?: string | null;
  parameters?: string | null;
  executionTime: Date;
  executionDuration: number; // in milliseconds
  clientIpAddress?: string | null;
  clientName?: string | null;
  browserInfo?: string | null;
  exception?: string | null;
  customData?: string | null;
};

// public class AuditLogListDto : EntityDto<long>
// {
//     public long? UserId { get; set; }

//     public string UserName { get; set; }

//     public int? ImpersonatorTenantId { get; set; }

//     public long? ImpersonatorUserId { get; set; }

//     public string ServiceName { get; set; }

//     public string MethodName { get; set; }

//     public string Parameters { get; set; }

//     public DateTime ExecutionTime { get; set; }

//     public int ExecutionDuration { get; set; }

//     public string ClientIpAddress { get; set; }

//     public string ClientName { get; set; }

//     public string BrowserInfo { get; set; }

//     public string Exception { get; set; }

//     public string CustomData { get; set; }
// }
