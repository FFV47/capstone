import { forwardRef, useImperativeHandle, useRef } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as images from "../../assets/images";
import formatDistanceToNow from "date-fns/esm/formatDistanceToNow";

import { GrLicense } from "react-icons/gr";
import IdentificationIcon from "../../icons/IdentificationIcon";
import JobsCheckIcon from "../../icons/JobsCheckIcon";
import MapPinIcon from "../../icons/MapPinIcon";
import StarFilledIcon from "../../icons/StarFilledIcon";
import RoleIcon from "../../icons/RoleIcon";

import type { TWorkerProfiles } from "../../queries/workerQuery";

type TProps = { profile: TWorkerProfiles[number] };

export type TWorkerCardRef = {
  cardScroll: () => void;
};

const WorkerCard = forwardRef<TWorkerCardRef, TProps>((props, ref) => {
  const aboutText =
    props.profile.about.length > 200
      ? `${props.profile.about.slice(0, 200)}...`
      : props.profile.about;

  const cardRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => {
    return {
      cardScroll: () => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      },
    };
  });

  return (
    <Card as={"article"} ref={cardRef} className={`profile-card shadow p-0`}>
      <Container className="card-body">
        <Row className="px-2">
          {/* Card header */}
          <Row className="justify-content-between align-items-center mx-0 mb-3">
            {/* Profile Image */}
            <Col xs={3} className="p-0">
              <Link to={`/worker/${props.profile.id}`}>
                <Card.Img
                  className="profile-img"
                  src={images[props.profile.imgURL as keyof typeof images]}
                  alt="Title"
                />
              </Link>
            </Col>

            {/* Profile Info */}
            <Col>
              <Link to={`/worker/${props.profile.id}`} className="profile-link">
                {props.profile.name}
              </Link>
              <p className="mb-1">
                {[...Array(props.profile.rating)].map((_, i) => (
                  <StarFilledIcon key={i} />
                ))}
              </p>
              <p className="mb-0">{props.profile.reviewCount} Reviews</p>
            </Col>
          </Row>

          {/* Details */}
          <div className="info-line">
            <RoleIcon />
            <p className="ms-2 mb-0">{props.profile.role}</p>
          </div>
          <div className="info-line">
            <JobsCheckIcon />
            <p className="ms-2 mb-0">{props.profile.jobsDone} jobs</p>
          </div>
          <div className="info-line">
            <MapPinIcon />
            <p className="ms-2 mb-0">{props.profile.location}</p>
          </div>
          {props.profile.verifiedID && (
            <div className="info-line">
              <IdentificationIcon />
              <p className="ms-2 mb-0">ID Verified</p>
            </div>
          )}
          {props.profile.drivingLicense && (
            <div className="info-line">
              <GrLicense className="heroicon driving-icon" />
              <p className="ms-2 mb-0">Driving license</p>
            </div>
          )}

          <Card.Text className="profile-about mt-2">{aboutText}</Card.Text>
        </Row>
      </Container>

      {/* Card footer */}
      <Card.Footer>
        <small className="text-muted">
          Last updated {formatDistanceToNow(new Date(props.profile.lastUpdate.substring(0, 19)))}{" "}
          ago
        </small>
      </Card.Footer>
    </Card>
  );
});

WorkerCard.displayName = "WorkerCard";
export default WorkerCard;
