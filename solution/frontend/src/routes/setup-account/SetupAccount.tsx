import { subYears } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { Outlet, redirect, useOutletContext } from "react-router-dom";
import { z } from "zod";
import { djangoUserData } from "../../django";
import useZodForm from "../../hooks/useZodForm";
import { Container } from "react-bootstrap";

// *** zod custom fields ***
const zStringRequired = (field: string) =>
  z
    .string()
    .trim()
    .min(2, { message: `${field} is required` });

const zNameRequired = (field: string) =>
  zStringRequired(field).regex(/^[A-Z][\w]{1,}/, {
    message: `${field} must be capitalized and contain 2 or more letters`,
  });

const zPhoneNumber = z.string().regex(/^(\d{1,3})(\d{2})(\d{9})$/);

const accountTypeSchema = z.object({
  accountType: z.enum(["business", "personal"]),
});
export type TAccount = z.infer<typeof accountTypeSchema>;

// *** Business Form ***
const companyInfoSchema = z.object({
  logo: z.instanceof(File).optional(),
  companyName: zNameRequired("Company name"),
  address: zStringRequired("Company address").regex(/[\w\d\s.#]{2,}/, {
    message: "Invalid address",
  }),
  legalName: zNameRequired("Legal name"),
  industry: zNameRequired("Industry"),
  companySize: z.enum(["micro", "small", "medium", "large", "enterprise"]),
  location: zNameRequired("Location"),
  companyUrl: z.string().url().optional().or(z.literal("")),
  description: z.string(),
});
export type TCompanyInfo = z.infer<typeof companyInfoSchema>;

const companyRepSchema = z.object({
  personalPhoto: z.instanceof(File).optional(),
  role: zNameRequired("Company role"),
  firstName: zNameRequired("First Name"),
  lastName: zNameRequired("Last Name"),
  phone: zPhoneNumber,
});

export type TCompanyRep = z.infer<typeof companyRepSchema>;

// *** Personal Form ***
export const maxBirthDate = subYears(new Date(), 18);
export const minBirthDate = subYears(new Date(), 80);

const personalInfoSchema = z.object({
  photo: z.instanceof(File).optional(),
  profession: zStringRequired("Profession"),
  firstName: zNameRequired("First Name"),
  lastName: zNameRequired("Last Name"),
  birthdate: z
    .date()
    .max(maxBirthDate, { message: "Too old!" })
    .min(minBirthDate, { message: "Too young!" }),
  phone: zPhoneNumber,
  location: zStringRequired("Location").regex(/^[A-Z][\w\s.,]{1,}/, {
    message: "Invalid location",
  }),
  about: z.string().optional(),
});

export type TPersonalInfo = z.infer<typeof personalInfoSchema>;

// *** Component ***
type Context = {
  accountForm: UseFormReturn<TAccount>;
  companyInfoForm: UseFormReturn<TCompanyInfo>;
  companyRepForm: UseFormReturn<TCompanyRep>;
  personalInfoForm: UseFormReturn<TPersonalInfo>;
};

export function useSetupAccountContext() {
  return useOutletContext<Context>();
}

export async function loader() {
  const { hasAccount } = djangoUserData;

  if (hasAccount) {
    return redirect("/user");
  }

  return null;
}

export default function SetupAccount() {
  const accountForm = useZodForm({ schema: accountTypeSchema });

  const companyInfoForm = useZodForm({
    schema: companyInfoSchema,
    defaultValues: {
      companyName: "Brave",
      legalName: "Brave",
      address: "3190283",
      industry: "Arts",
      companySize: undefined,
      location: "New York",
    },
  });

  const companyRepForm = useZodForm({
    // @ts-ignore
    schema: companyRepSchema,
    defaultValues: {
      role: "Consultant",
      firstName: "John",
      lastName: "Dow",
      phone: "12345918723897",
    },
  });

  const personalInfoForm = useZodForm({
    // @ts-ignore
    schema: personalInfoSchema,
    defaultValues: {
      profession: "Painter",
      firstName: "John",
      lastName: "Doe",
      phone: "12345918723897",
      location: "New York",
      birthdate: subYears(new Date(new Date().getFullYear(), 0, 0, 0, 0, 0, 0), 20),
      about: "I am a painter.",
    },
  });

  return (
    <Container fluid="sm" id="setup-account" className="flex-grow-1">
      <Outlet context={{ accountForm, companyInfoForm, companyRepForm, personalInfoForm }} />
    </Container>
  );
}
