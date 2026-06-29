export enum EmployeeRoles {
  LoanApprover = 0,
  LoanMaker = 1,
  LoanProductMaker = 2,
  LoanProductApprover = 3,
  EmployeeMaker = 4,
  EmployeeApprover = 5,
  EmployeeRoleApprover = 6,
  EmployeeRoleMaker = 7,
  CustomerMaker = 8,
  Admin = 9,
}
export const RoleDisplayNames: Record<EmployeeRoles, string> = {
  [EmployeeRoles.LoanApprover]: "Loan Approver",
  [EmployeeRoles.LoanMaker]: "Loan Maker",
  [EmployeeRoles.LoanProductMaker]: "Loan Product Maker",
  [EmployeeRoles.LoanProductApprover]: "Loan Product Approver",
  [EmployeeRoles.EmployeeMaker]: "Employee Maker",
  [EmployeeRoles.EmployeeApprover]: "Employee Approver",
  [EmployeeRoles.EmployeeRoleApprover]: "Employee Role Approver",
  [EmployeeRoles.EmployeeRoleMaker]: "Employee Role Maker",
  [EmployeeRoles.CustomerMaker]: "Customer Maker",
  [EmployeeRoles.Admin]: "Administrator",
};

export const EmployeeRoleDisplayValues = Object.values(RoleDisplayNames);

export const RoleNameToValueMap: Record<string, EmployeeRoles> = Object.entries(
  RoleDisplayNames,
).reduce(
  (acc, [key, value]) => {
    acc[value] = Number(key) as EmployeeRoles;
    return acc;
  },
  {} as Record<string, EmployeeRoles>,
);

export function EmployeeRolesReadable(
  roleValue: EmployeeRoles | number,
): string {
  return RoleDisplayNames[roleValue as EmployeeRoles] ?? "Unknown Role";
}
export const EnumKeyToValueMap: Record<string, number> = Object.entries(
  EmployeeRoles,
).reduce(
  (acc, [key, value]) => {
    if (typeof value === "number") {
      acc[key] = value;
    }
    return acc;
  },
  {} as Record<string, number>,
);
