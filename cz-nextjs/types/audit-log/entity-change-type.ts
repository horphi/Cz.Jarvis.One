import { TEntityPropertyChange } from "./entity-property-changes-type";

export type EntityListDto = {
  totalCount: number;
  items: TEntityChange[];
};

export type TEntityChange = {
  id: number;
  userId?: number | null;
  userName?: string | null;
  changeTime: Date;
  changeType: number; // 0 = Created, 1 = Updated, 2 = Deleted
  entityTypeFullName?: string | null;
  entityId?: string | null;
  tenantId?: number | null;
  entityChangeSetId?: number | null;
  propertyChanges?: TEntityPropertyChange[];
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
