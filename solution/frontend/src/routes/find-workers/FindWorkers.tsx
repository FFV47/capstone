import { QueryClient, useQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import workerQuery from "../../queries/workerQuery";
import WorkerCard from "./WorkerCard";

import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { RootLoaderData } from "../Root";
import FilteredWorkerCards from "./FilteredWorkerCards";
import WorkerSearch from "./WorkerSearch";
import { LoaderData } from "../../utils/utils";

export function loader(queryClient: QueryClient) {
  return async () => {
    const profiles = await queryClient.ensureQueryData(workerQuery);

    if (!profiles || !profiles.length)
      throw new Response("Worker profiles not found", { status: 404 });

    return profiles;
  };
}

export default function FindWorkers() {
  const roles = useRouteLoaderData("root") as RootLoaderData;
  const initialData = useLoaderData() as LoaderData<typeof loader>;
  const { data: profiles } = useQuery({ ...workerQuery, initialData });

  const [filteredProfiles, setFilteredProfiles] = useState(profiles);

  const fiveStarProfiles = profiles.filter((profile) => profile.rating === 5).slice(0, 3);

  return (
    <main id="find-workers">
      <Container>
        <header>
          <h1 className="text-center mt-2 mb-2">Meet some of our high rated workers</h1>
        </header>
        {/* Rated worker cards */}
        <Row xs={"auto"} md={2} lg={3} className="id__worker-card justify-content-evenly gy-3">
          {fiveStarProfiles.map((profile) => (
            <Col key={profile.id}>
              <WorkerCard profile={profile} />
            </Col>
          ))}
        </Row>
      </Container>
      <div className="divider mt-3"></div>
      <Container className="mb-3">
        <Row>
          <Col xs={12} lg={4}>
            {/* Search and Filter */}
            <WorkerSearch
              queryProfiles={profiles}
              setFilteredProfiles={setFilteredProfiles}
              roles={roles}
            />
          </Col>
          <Col>
            {/* Worker Cards result */}
            <FilteredWorkerCards filteredProfiles={filteredProfiles} />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
