import axios from "axios";
import { z } from "zod";
import createZodUnionSchema from "../utils/createZodUnionSchema";

// Job types
const jobTypeValues = ["Part-Time", "Full-Time", "Overtime", "Contract", "Internship"] as const;

const availableJobTypesSchema = z.tuple(createZodUnionSchema(jobTypeValues));

const jobTypesSchema = z.array(z.enum(jobTypeValues));

// Shifts
const shiftValues = [
  "Day Shift",
  "Night Shift",
  "Overnight Shift",
  "4 Hour Shift",
  "8 Hour Shift",
  "12 Hour Shift",
  "24 Hour Shift",
] as const;

const availableShiftsSchema = z.tuple(createZodUnionSchema(shiftValues));

const shiftsSchema = z.array(z.enum(shiftValues));

// Schedules
const scheduleValues = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday to Friday",
  "Weekend",
  "Whole Week",
  // "Weekend availability",
] as const;

const availableScheduleSchema = z.tuple(createZodUnionSchema(scheduleValues));

const schedulesSchema = z.array(z.enum(scheduleValues));

const workScheduleSchema = z
  .array(
    z.object({
      schedules: schedulesSchema,
      from: z.string().datetime(),
      to: z.string().datetime(),
    })
  )
  .optional();

// Extra tags
const tagValues = ["Hiring multiple candidates", "Urgently hiring", "Temporary"] as const;

const availableTagsSchema = z.tuple(createZodUnionSchema(tagValues));

const tagsSchema = z.array(z.enum(tagValues)).optional();

// Query schema
const jobSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    companyRep: z.string(),
    companyName: z.string(),
    companyDescription: z.string().optional(),
    description: z.string(),
    location: z.string(),
    types: jobTypesSchema,
    shifts: shiftsSchema,
    responsibilities: z.array(z.string()).optional(),
    qualifications: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    salaryRange: z
      .object({
        min: z.number(),
        max: z.number().optional(),
        period: z.union([z.literal("hour"), z.literal("day"), z.literal("month"), z.literal("year")]),
      })
      .optional(),
    workSchedules: workScheduleSchema,
    applicationInstructions: z.string().optional(),
    tags: tagsSchema,
    postedDate: z.string().datetime(),
  })
);

export const findJobSchema = z.object({
  jobs: jobSchema,
  availableJobTypes: availableJobTypesSchema,
  availableShifts: availableShiftsSchema,
  availableSchedule: availableScheduleSchema,
  availableTags: availableTagsSchema,
});

export type FindJobsQuery = z.infer<typeof findJobSchema>;

const getFindJobsQuery = () => ({
  queryKey: ["findJobQuery"],
  queryFn: async () => {
    const { data } = await axios.get("http://localhost:3000/find-jobs");
    return findJobSchema.parse(data);
  },
});

export default getFindJobsQuery;
