export enum EmployeeRoles {
  /** Views request of loan and approves or rejects them */
  LoanApprover = "LoanApprover",

  /** Creates the loan request and their details */
  LoanMaker = "LoanMaker",

  /** Creates the loan products and their details */
  LoanProductMaker = "LoanProductMaker",

  /** Approves or rejects the loan products and their details */
  LoanProductApprover = "LoanProductApprover",

  /** Creates the employees and their details */
  EmployeeMaker = "EmployeeMaker",

  /** Approves or rejects the employees and their details */
  EmployeeApprover = "EmployeeApprover",

  /** Approves or rejects the employee roles and their details */
  EmployeeRoleApprover = "EmployeeRoleApprover",

  /** Creates the employee roles and their details */
  EmployeeRoleMaker = "EmployeeRoleMaker",

  /** Creates the users and their details */
  CustomerMaker = "CustomerMaker",

  /** Approves or rejects the customers and their details */
  CustomerApprover = "CustomerApprover",
}
