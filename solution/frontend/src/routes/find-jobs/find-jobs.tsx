import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import JobHighlightCard from "./JobHighlightCard";
import getFindJobsQuery, { FindJobsQuery } from "../../queries/findJobsQuery";

export type FindJobsLoaderData = Awaited<ReturnType<ReturnType<typeof loader>>>;

const findJobsQuery = getFindJobsQuery();

function getRandomIntInclusive(min: number, max: number): number {
  const roundedMin = Math.floor(min);
  const roundedMax = Math.ceil(max);

  return Math.floor(Math.random() * (roundedMax - roundedMin + 1)) + roundedMin;
}

export function loader(queryClient: QueryClient) {
  return async () => {
    const findJobsObject = await queryClient.ensureQueryData(findJobsQuery);

    for (const key in findJobsObject) {
      if (Object.prototype.hasOwnProperty.call(findJobsObject, key)) {
        const element = findJobsObject[key as keyof FindJobsQuery];
        if (!element) throw new Response(`${key} not found`, { status: 404 });
      }
    }

    return findJobsObject;
  };
}

export default function FindJobs() {
  const initialData = useLoaderData() as FindJobsLoaderData;
  const { data: findJobsData } = useQuery({ ...findJobsQuery, initialData });

  const mostRecentJob = findJobsData.jobs[0];

  const navigate = useNavigate();

  const [tab, setTab] = useState("feed");

  return (
    <div id="find-jobs" className="container mt-3 mb-3">
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
    </div>
  );
}
