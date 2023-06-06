import { Primitive, z, ZodLiteral, ZodNever } from "zod";

type MappedZodLiterals<T extends readonly Primitive[]> = {
  -readonly [K in keyof T]: ZodLiteral<T[K]>;
};

function createMany<A extends Readonly<[Primitive, Primitive, ...Primitive[]]>>(literals: A) {
  return literals.map((value) => z.literal(value)) as MappedZodLiterals<A>;
}

function createZodUnionSchema<T extends readonly []>(values: T): ZodNever;
function createZodUnionSchema<T extends readonly [Primitive]>(values: T): ZodLiteral<T[0]>;
function createZodUnionSchema<T extends readonly [Primitive, Primitive, ...Primitive[]]>(
  values: T
): MappedZodLiterals<T>;
function createZodUnionSchema<T extends readonly Primitive[]>(values: T) {
  if (values.length > 1) {
    return createMany(values as typeof values & [Primitive, Primitive, ...Primitive[]]);
  } else if (values.length === 1) {
    return z.literal(values[0]);
  } else if (values.length === 0) {
    return z.never();
  }
  throw new Error("Array must have a length");
}

export default createZodUnionSchema;

// EXAMPLES
// const emptySchema = createMappedSchema([] as const);
// const singletonSchema = createMappedSchema(["a"] as const);
// const manySchema = createMappedSchema(["a", "b", "c"] as const);

// type EmptyType = z.infer<typeof emptySchema>;
// type SingletonType = z.infer<typeof singletonSchema>;
// type ManyType = z.infer<typeof manySchema>;
