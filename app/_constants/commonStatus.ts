export enum CommonStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Ongoing = 3,
  Done = 4,
  Cancelled = 5,
}

export const CommonStatusDisplayNames: Record<CommonStatus, string> = {
  [CommonStatus.Pending]: "Pending",
  [CommonStatus.Approved]: "Approved",
  [CommonStatus.Rejected]: "Rejected",
  [CommonStatus.Ongoing]: "Ongoing",
  [CommonStatus.Done]: "Done",
  [CommonStatus.Cancelled]: "Cancelled",
};

export const CommonStatusDisplayValues = Object.values(
  CommonStatusDisplayNames,
);

export const CommonStatusNameToValueMap: Record<string, CommonStatus> =
  Object.entries(CommonStatusDisplayNames).reduce(
    (acc, [key, value]) => {
      acc[value] = Number(key) as CommonStatus;
      return acc;
    },
    {} as Record<string, CommonStatus>,
  );

export function CommonStatusReadable(status: CommonStatus | number): string {
  return CommonStatusDisplayNames[status as CommonStatus] ?? "Unknown Status";
}

export const CommonStatusKeyToValueMap: Record<string, number> = Object.entries(
  CommonStatus,
).reduce(
  (acc, [key, value]) => {
    if (typeof value === "number") {
      acc[key] = value;
    }
    return acc;
  },
  {} as Record<string, number>,
);
