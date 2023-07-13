import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import JobHighlightCard from "./JobHighlightCard";
import axios from "axios";
import { z } from "zod";
import { Container } from "react-bootstrap";
import { LoaderData } from "../../utils/utils";

// *** zod query validation ***
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

export const findJobSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    companyRep: z.string(),
    companyName: z.string(),
    companyDescription: z.string().optional(),
    description: z.string(),
    location: z.string(),
    types: z.array(z.string()),
    shifts: z.array(z.string()),
    responsibilities: z.array(z.string()).optional(),
    qualifications: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional(),
    salaryRange: z
      .object({
        min: z.number(),
        max: z.number().optional(),
        period: z.union([
          z.literal("hour"),
          z.literal("day"),
          z.literal("month"),
          z.literal("year"),
        ]),
      })
      .optional(),
    workSchedules: workScheduleSchema,
    applicationInstructions: z.string().optional(),
    tags: z.array(z.string()),
    postedDate: z.string().datetime(),
  })
);

export type FindJobsQuery = z.infer<typeof findJobSchema>;

// *** data fetch ***
const findJobsQuery = {
  queryKey: ["findJobQuery"],
  queryFn: async () => {
    const { data } = await axios.get("http://localhost:3000/find-jobs");
    return findJobSchema.parse(data);
  },
};

// *** Component ***
export type FindJobsLoaderData = LoaderData<typeof loader>;

export function loader(queryClient: QueryClient) {
  return async () => {
    const findJobsObject = await queryClient.ensureQueryData(findJobsQuery);

    if (!findJobsObject) throw new Response(`jobs not found`, { status: 404 });

    return findJobsObject;
  };
}

export default function FindJobs() {
  const initialData = useLoaderData() as FindJobsLoaderData;
  const { data: jobs } = useQuery({ ...findJobsQuery, initialData });

  const mostRecentJob = jobs[0];

  const navigate = useNavigate();

  const [tab, setTab] = useState("feed");

  return (
    <Container id="find-jobs" className="mt-3 mb-3">
      <h1 className="display-5 text-center">Recently added</h1>
      <JobHighlightCard job={mostRecentJob} />

      <section className="mt-3">
        <hr />
        {/* <h3 className="text-center">Job Feed</h3> */}
        <Tabs
          activeKey={tab}
          onSelect={(k) => {
            setTab(k as string);
            navigate(k as string);
          }}
          id="justify-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="feed" title="Job feed">
            <Outlet />
          </Tab>

          <Tab eventKey="favorites" title="Favorites">
            <Outlet />
          </Tab>
        </Tabs>
      </section>
    </Container>
  );
}
