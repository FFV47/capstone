import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { Link, useParams, useRouteLoaderData } from "react-router-dom";
import ExternalLinkIcon from "../../../icons/ExternalLinkIcon";
import CardTags from "../CardTags";
import { FindJobsLoaderData } from "../FindJobs";

type RouteParams = {
  id: string;
};

export default function SelectedJobCard() {
  const jobs = useRouteLoaderData("find-jobs") as FindJobsLoaderData;
  const { id } = useParams<RouteParams>();
  const job = jobs.find((item) => item.id === Number(id));

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Resize element to fit in the viewport
    const handleResize = () => {
      if (cardRef.current) {
        const distanceToBottom = window.innerHeight - cardRef.current.getBoundingClientRect().y;
        const elementHeight = cardRef.current.getBoundingClientRect().height;

        // The elementHeight sum value is high to avoid flickering the element overflow
        if (distanceToBottom < elementHeight + 300 && distanceToBottom > 300) {
          cardRef.current.style.height = `${distanceToBottom - 30}px`;
        }
      }
    };

    handleResize();
    window.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("scroll", handleResize);
    };
  }, []);

  if (!job) {
    return <div>Loading...</div>;
  }
  return (
    <Card id="selected-job-card" className="shadow-sm" ref={cardRef}>
      <Card.Body className="selected-job-head">
        <p className="h3">{job.title}</p>
        <Card.Subtitle className="mb-2 text-muted">{job.companyName}</Card.Subtitle>
        <Card.Text>{job.description}</Card.Text>
        <Link to={""} className="btn btn-primary fs-5 px-4">
          Apply Now <ExternalLinkIcon style={{ verticalAlign: "text-bottom" }} />
        </Link>
      </Card.Body>

      <div className="selected-job-body">
        <Card.Body>
          <p className="h4">Details</p>
          <CardTags job={job} unwrapTags />
        </Card.Body>
        <ListGroup as="ul" variant="flush" className="border-top">
          <ListGroup.Item as="li">
            <strong>Location:</strong> {job.location}
          </ListGroup.Item>

          {job.responsibilities?.length && (
            <ListGroup.Item as="li">
              <strong>Responsibilities:</strong>
              <ul>
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </ListGroup.Item>
          )}

          {job.qualifications?.length && (
            <ListGroup.Item as="li">
              <strong>Qualifications:</strong>
              <ul>
                {job.qualifications.map((qualification, index) => (
                  <li key={index}>{qualification}</li>
                ))}
              </ul>
            </ListGroup.Item>
          )}

          {job.benefits?.length && (
            <ListGroup.Item as="li">
              <strong>Benefits:</strong>
              <ul>
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </ListGroup.Item>
          )}

          {/* {job.workSchedules?.length && (
            <ListGroup.Item as="li">
              <strong>Schedule:</strong>
              <ul>
                {job.workSchedules.map((item, i) => (
                  <li key={i}>
                    {item.schedules.join(", ")} from {format(new Date(item.from), "HH:mm")} to{" "}
                    {format(new Date(item.to), "HH:mm")}
                  </li>
                ))}
              </ul>
            </ListGroup.Item>
          )} */}

          <ListGroup.Item as="li">
            <strong>Application Instructions:</strong> {job.applicationInstructions}
          </ListGroup.Item>
        </ListGroup>
        <Card.Footer>
          <strong>Posted Date:</strong> {format(new Date(job.postedDate), "PPPPp")}
        </Card.Footer>
      </div>
    </Card>
  );
}
