import { EmployeeRoles } from "@/app/_constants/employeeRoles";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type FormState = {
  Id: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Suffix: string;
  Email: string;
  EmployeeRoles: EmployeeRoles[];
};

export function EmployeeApplicationForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  <Card className="w-full max-w-2xl" {...props}></Card>;
}
