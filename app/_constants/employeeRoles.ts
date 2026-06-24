export enum EmployeeRoles {
  /** Views request of loan and approves or rejects them */
  LoanApprover = "Loan Approver",

  /** Creates the loan request and their details */
  LoanMaker = "Loan Maker",

  /** Creates the loan products and their details */
  LoanProductMaker = "Loan Product Maker",

  /** Approves or rejects the loan products and their details */
  LoanProductApprover = "Loan Product Approver",

  /** Creates the employees and their details */
  EmployeeMaker = "Employee Maker",

  /** Approves or rejects the employees and their details */
  EmployeeApprover = "Employee Approver",

  /** Approves or rejects the employee roles and their details */
  EmployeeRoleApprover = "Employee Role Approver",

  /** Creates the employee roles and their details */
  EmployeeRoleMaker = "Employee Role Maker",

  /** Creates the users and their details */
  CustomerMaker = "Customer Maker",

  /** Approves or rejects the customers and their details */
  CustomerApprover = "Customer Approver",

  Admin = "Admin",
}
