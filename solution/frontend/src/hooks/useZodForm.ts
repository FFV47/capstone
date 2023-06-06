import { FieldValues, useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Props<T extends FieldValues> = {
  schema: z.ZodSchema<T>;
} & Omit<UseFormProps<T>, "resolver">;

export default function useZodForm<T extends FieldValues>({ schema, ...rest }: Props<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    ...rest,
  });
}
