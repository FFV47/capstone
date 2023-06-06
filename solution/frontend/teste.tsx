import { z } from "zod";

// Define the specific values that are allowed.
const specificValues = ["value1", "value2", "value3"] as const;

// Create the Zod schema.
const SpecificStringArraySchema = z.array(z.enum(specificValues));

// Test the schema with some examples.
const validArray = ["value1", "value2", "value1"];
const invalidArray = ["value1", "invalidValue", "value2"];

try {
  SpecificStringArraySchema.parse(validArray);
  console.log("Valid array:", validArray);
} catch (error) {
  console.error("Invalid array:", error);
}

try {
  SpecificStringArraySchema.parse(invalidArray);
  console.log("Valid array:", invalidArray);
} catch (error) {
  console.error("Invalid array:", error);
}
