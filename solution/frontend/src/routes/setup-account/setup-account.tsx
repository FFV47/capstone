import { subYears } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { Outlet, redirect, useOutletContext } from "react-router-dom";
import { z } from "zod";
import { djangoUserData } from "../../django";
import useZodForm from "../../hooks/useZodForm";

const accountTypeSchema = z.object({
  accountType: z.enum(["business", "personal"]),
});
export type Account = z.infer<typeof accountTypeSchema>;

const capitalizedRegex = /^[A-Z][\w]{1,}/;

const zPhoneNumber = z
  .string()
  .regex(/(\d{1,3})(\d{2})(\d{9})/)
  .transform((x) => parseInt(x, 10));

// *******************************
// * Business Form
// *******************************
const companyInfoSchema = z.object({
  companyLogo: z.instanceof(Blob).optional(),
  companyName: z.string().regex(capitalizedRegex),
  companyAddress: z.string().regex(/[\w\d\s.#]{2,}/),
  legalName: z.string().regex(capitalizedRegex),
  industry: z.string().regex(capitalizedRegex),
  companySize: z.enum(["tiny", "small", "medium", "big"]).or(z.literal("")),
  location: z.string().regex(capitalizedRegex),
  companyLink: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});
export type CompanyInfo = z.infer<typeof companyInfoSchema>;

const companyRepSchema = z.object({
  companyRole: z.string().regex(capitalizedRegex),
  companyRepPhoto: z.instanceof(Blob).optional(),
  companyRepFirstName: z.string().regex(/^[A-Z][a-z]{2,}$/),
  companyRepLastName: z.string().regex(/^[A-Z][a-z]{2,}$/),
  companyRepPhone: zPhoneNumber,
});

export type CompanyRep = z.infer<typeof companyRepSchema>;

// *******************************
// * Personal Form
// *******************************
export const maxBirthDate = subYears(new Date(), 18);
export const minBirthDate = subYears(new Date(), 80);

const personalInfoSchema = z.object({
  photo: z.instanceof(Blob).optional(),
  profession: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.date().max(maxBirthDate, { message: "Too old!" }).min(minBirthDate, { message: "Too young!" }),
  phone: zPhoneNumber,
  location: z.string(),
  aboutMe: z.string().optional(),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// * COMPONENT
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
      companyAddress: "3190283",
      industry: "Arts",
      companySize: "small",
      location: "New York",
    },
  });

  const companyRepForm = useZodForm({
    // @ts-ignore
    schema: companyRepSchema,
    defaultValues: {
      companyRole: "Consultant",
      companyRepFirstName: "John",
      companyRepLastName: "Dow",
      companyRepPhone: 123459187238971,
    },
  });

  const personalInfoForm = useZodForm({
    // @ts-ignore
    schema: personalInfoSchema,
    defaultValues: {
      firstName: "John",
      lastName: "Dow",
      phone: 12345918723897,
      location: "New York",
      // birthDate: subYears(new Date(new Date().getFullYear(), 0, 0, 0, 0, 0, 0), 20),
    },
  });

  return (
    <div id="setup-account" className="container d-flex flex-grow-1 mt-3">
      <Outlet context={{ accountForm, companyInfoForm, companyRepForm, personalInfoForm }} />
    </div>
  );
}

type Context = {
  accountForm: UseFormReturn<Account>;
  companyInfoForm: UseFormReturn<CompanyInfo>;
  companyRepForm: UseFormReturn<CompanyRep>;
  personalInfoForm: UseFormReturn<PersonalInfo>;
};

export function useSetupAccountContext() {
  return useOutletContext<Context>();
}
