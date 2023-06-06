import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Outlet, useRouteLoaderData } from "react-router-dom";
import JobMiniCard from "./JobMiniCard";
import JobSearch from "./JobSearch";
import { FindJobsLoaderData } from "./find-jobs";

export default function JobFeed() {
  const { jobs } = useRouteLoaderData("find-jobs") as FindJobsLoaderData;

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  return (
    <Row>
      <Col xs={12} lg={5} as="article">
        <JobSearch jobs={jobs} setFilteredJobs={setFilteredJobs} />
        {/* Search result */}
        {filteredJobs.length ? (
          filteredJobs.map((job, i) => {
            return <JobMiniCard key={i} job={job} />;
          })
        ) : (
          <div className="d-flex justify-content-center display-6">No jobs found</div>
        )}
      </Col>
      <Col as="article" className="d-none d-lg-block">
        <Outlet />
      </Col>
    </Row>
  );
}
