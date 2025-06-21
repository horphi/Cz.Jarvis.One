export type TEntityPropertyChange = {
  id: number;
  entityChangeId: number;
  newValue?: string | null;
  originalValue?: string | null;
  propertyName?: string | null;
  propertyTypeFullName?: string | null;
  tenantId?: number | null;
};
