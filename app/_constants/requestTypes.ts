export enum RequestTypes {
  Add = 0,
  Remove = 1,
}

export const RequestTypeDisplayNames: Record<RequestTypes, string> = {
  [RequestTypes.Add]: "Add",
  [RequestTypes.Remove]: "Remove",
};

export const RequestDisplayValues = Object.values(RequestTypeDisplayNames);

export const RequestTypeToValueMap: Record<string, RequestTypes> =
  Object.entries(RequestTypeDisplayNames).reduce(
    (acc, [key, value]) => {
      acc[value] = Number(key) as RequestTypes;
      return acc;
    },
    {} as Record<string, RequestTypes>,
  );

export function RequestTypeReadable(
  requestTypeValue: RequestTypes | number,
): string {
  return (
    RequestTypeDisplayNames[requestTypeValue as RequestTypes] ?? "Unknown Role"
  );
}
