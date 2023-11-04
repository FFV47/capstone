import { Card, Col, ListGroup, Row } from "react-bootstrap";
import companyLogo from "../../assets/companyLogo.jpg";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import CardTags from "./CardTags";
import type { TFindJobsQuery } from "./FindJobs";

type TProps = {
  job: TFindJobsQuery[number];
};

export default function JobHighlightCard({ job }: TProps) {
  return (
    <Card id="job-highlight-card" as="article" className="shadow-sm">
      <Row className="g-0">
        <Col xs={12} md={4} className="align-self-center">
          <img src={companyLogo} alt="company business logo" className="img-fluid rounded-start" />
        </Col>
        <Col xs={12} md={8} className="d-flex flex-column card-border">
          <Card.Body>
            <Card.Title>{job.title}</Card.Title>
            <Card.Subtitle className="text-muted">
              {job.companyName} - {job.location}
            </Card.Subtitle>
            <CardTags job={job} unwrapTags />
          </Card.Body>
          <ListGroup variant="flush" className="flex-grow-1">
            {job.responsibilities?.map((responsibility, i) => (
              <ListGroup.Item key={i}>{responsibility}</ListGroup.Item>
            ))}
          </ListGroup>
          <Card.Footer>{`Posted ${formatDistanceToNow(new Date(job.postedDate), {
            includeSeconds: true,
            addSuffix: true,
          })}`}</Card.Footer>
        </Col>
      </Row>
    </Card>
  );
}
