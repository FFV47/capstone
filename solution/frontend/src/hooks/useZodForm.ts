import { FieldValues, useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props<T extends FieldValues> extends Omit<UseFormProps<T>, "resolver"> {
  schema: z.ZodSchema<T>;
}

export default function useZodForm<T extends FieldValues>({ schema, ...rest }: Props<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    ...rest,
  });
}
