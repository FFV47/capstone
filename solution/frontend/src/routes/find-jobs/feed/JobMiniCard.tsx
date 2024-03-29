import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import CardTags from "../CardTags";
import type { TFindJobsQuery } from "../FindJobs";

type TProps = {
  job: TFindJobsQuery[number];
};

export default function JobMiniCard({ job }: TProps) {
  const [showMore, setShowMore] = useState(false);

  let responsibilities = job.responsibilities;
  if (Number(job.responsibilities?.length) > 3 && !showMore) {
    responsibilities = job.responsibilities?.slice(0, 3);
  }

  return (
    <Card className="id__job-mini-card shadow-lg">
      <Card.Body>
        <Link to={`${job.id}`} className="stretched-link">
          <Card.Title>{job.title}</Card.Title>
        </Link>

        <Card.Subtitle className="text-muted">
          {job.companyName} - {job.location}
        </Card.Subtitle>

        <Card.Text>{`Posted by ${job.companyRep}`}</Card.Text>

        <CardTags job={job} />

        <ul className="mt-2">
          {responsibilities?.map((responsibility, i) => <li key={i}>{responsibility}</li>)}
        </ul>

        {Number(job.responsibilities?.length) > 3 && (
          <button
            type="button"
            className="btn position-relative"
            onClick={() => setShowMore(!showMore)}
          >
            {!showMore ? "More..." : "Less..."}
          </button>
        )}
      </Card.Body>

      <Card.Footer>{`Posted ${formatDistanceToNow(new Date(job.postedDate), {
        includeSeconds: true,
        addSuffix: true,
      })}`}</Card.Footer>
    </Card>
  );
}
