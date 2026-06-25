export enum RequestType {
  NewEmployee = 0,
  UpdateEmployeeRole = 1,
  DeactivateEmployee = 2,
}

export const RequestTypeDisplayNames: Record<RequestType, string> = {
  [RequestType.NewEmployee]: "New Employee Registration",
  [RequestType.UpdateEmployeeRole]: "Update Employee Role",
  [RequestType.DeactivateEmployee]: "Deactivate Employee",
};

export const RequestTypeReadable = (value: RequestType | number): string => {
  return (
    RequestTypeDisplayNames[value as RequestType] ?? "Unknown Request Type"
  );
};
