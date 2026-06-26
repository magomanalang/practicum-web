export enum LoanCategories {
  Housing = 0,
  Vehicle = 1,
  Personal = 2,
  Education = 3,
  WorkingCapital = 4,
  EquipmentFinancing = 5,
  CommercialRealEstate = 6,
  ProjectFinance = 7,
  Agricultural = 8,
  Microfinance = 9,
  RevolvingCredit = 10,
}
export const LoanCategoryNames: Record<LoanCategories, string> = {
  [LoanCategories.Housing]: "Housing",
  [LoanCategories.Vehicle]: "Vehicle",
  [LoanCategories.Personal]: "Personal",
  [LoanCategories.Education]: "Education",
  [LoanCategories.WorkingCapital]: "Working Capital",
  [LoanCategories.EquipmentFinancing]: "Equipment Financing",
  [LoanCategories.CommercialRealEstate]: "Commercial Real Estate",
  [LoanCategories.ProjectFinance]: "Project Finance",
  [LoanCategories.Agricultural]: "Agricultural",
  [LoanCategories.Microfinance]: "Microfinance",
  [LoanCategories.RevolvingCredit]: "Revolving Credit",
};

export const LoanCategoriesDisplayValues = Object.values(LoanCategoryNames);

export const LoanCategoriesToValueMap: Record<string, LoanCategories> =
  Object.entries(LoanCategoryNames).reduce(
    (acc, [key, value]) => {
      acc[value] = Number(key) as LoanCategories;
      return acc;
    },
    {} as Record<string, LoanCategories>,
  );

export function LoanCategoriesReadable(
  categoryValue: LoanCategories | number,
): string {
  return (
    LoanCategoryNames[categoryValue as LoanCategories] ?? "Unknown Category"
  );
}
