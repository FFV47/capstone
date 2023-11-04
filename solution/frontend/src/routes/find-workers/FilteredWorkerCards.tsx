import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TWorkerProfiles } from "../../queries/workerQuery";
import WorkerCard, { TWorkerCardRef } from "./WorkerCard";
import { Col, Row } from "react-bootstrap";

type TProps = {
  filteredProfiles: TWorkerProfiles;
};

export default function FilteredWorkerCards({ filteredProfiles }: TProps) {
  const location = useLocation();
  const firstResultElem = useRef<TWorkerCardRef>(null);

  useEffect(() => {
    if (filteredProfiles.length && location.search) {
      firstResultElem.current?.cardScroll();
    }
  }, [filteredProfiles.length, location.search]);

  return (
    <Row xs={"auto"} md={2} className="id__worker-card justify-content-center gy-3 mt-1 mt-lg-0">
      {filteredProfiles ? (
        filteredProfiles.map((profile, i) => {
          return (
            <Col key={profile.id}>
              {i === 0 ? (
                <WorkerCard ref={firstResultElem} profile={profile} />
              ) : (
                <WorkerCard profile={profile} />
              )}
            </Col>
          );
        })
      ) : (
        <div>Loading...</div>
      )}
    </Row>
  );
}
