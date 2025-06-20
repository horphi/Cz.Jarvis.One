export type TEntityChange = {
  id: number;
  changeTime: Date;
  changeType: number; // 0 = Created, 1 = Updated, 2 = Deleted
  entityId?: string | null;
  entityTypeFullName?: string | null;
  tenantId?: number | null;
  userId?: number | null;
  userName?: string | null;
  impersonatorTenantId?: number | null;
  impersonatorUserId?: number | null;
  reason?: string | null;
  propertyChanges?: TEntityPropertyChange[];
};

export type TEntityPropertyChange = {
  id: number;
  entityChangeId: number;
  newValue?: string | null;
  originalValue?: string | null;
  propertyName?: string | null;
  propertyTypeFullName?: string | null;
  tenantId?: number | null;
};

export enum EntityChangeType {
  Created = 0,
  Updated = 1,
  Deleted = 2,
}

export const getEntityChangeTypeText = (changeType: number): string => {
  switch (changeType) {
    case EntityChangeType.Created:
      return "Created";
    case EntityChangeType.Updated:
      return "Updated";
    case EntityChangeType.Deleted:
      return "Deleted";
    default:
      return "Unknown";
  }
};

export const getEntityChangeTypeColor = (changeType: number): string => {
  switch (changeType) {
    case EntityChangeType.Created:
      return "text-green-600";
    case EntityChangeType.Updated:
      return "text-blue-600";
    case EntityChangeType.Deleted:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};
