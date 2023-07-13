import { QueryClient, useQuery } from "@tanstack/react-query";
import { Form, useLoaderData, useParams } from "react-router-dom";
import * as images from "../assets/images";

import { useState } from "react";
import { GrLicense } from "react-icons/gr";
import { djangoUserData } from "../django";

import IdentificationIcon from "../icons/IdentificationIcon";
import JobsCheckIcon from "../icons/JobsCheckIcon";
import MapPinIcon from "../icons/MapPinIcon";
import RoleIcon from "../icons/RoleIcon";
import StarFilledIcon from "../icons/StarFilledIcon";
import StarOutlineIcon from "../icons/StarOutlineIcon";
import workerQuery from "../queries/workerQuery";
import { Card, Col, Container, Row } from "react-bootstrap";
import { LoaderData } from "../utils/utils";

export function loader(queryClient: QueryClient) {
  return async () => {
    const { authenticated } = djangoUserData;

    if (!authenticated) {
      throw new Response("User is not authenticated", { status: 401 });
    }

    const profiles = queryClient.ensureQueryData(workerQuery);

    if (!profiles) throw new Response("Worker profiles not found", { status: 404 });

    return profiles;
  };
}

export default function WorkerPage() {
  const [rating, setRating] = useState(0);
  const [mouseRating, setMouseRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const params = useParams();

  const initialData = useLoaderData() as LoaderData<typeof loader>;
  const { data: profiles } = useQuery({ ...workerQuery, initialData });

  const profile = profiles.find((profile) => profile.id === Number(params.id));

  if (!profile) {
    return <div>Worker profile with ID ${params.id} not found.</div>;
  }

  return (
    <Container id="worker-page" as="main" className="id__worker-card d-flex flex-column mt-4 mb-5">
      <Row>
        <Col xs={12} md={6} lg={5}>
          <Card>
            <Card.Body>
              <Row className="justify-content-around align-items-center">
                {/* Profile Image */}
                <Col xs={8} md={4} className="px-3 p-md-0 mx-md-3">
                  <img
                    className="profile-img"
                    src={images[profile.imgURL as keyof typeof images]}
                    alt="Title"
                  />
                </Col>

                <Col className="mt-3">
                  {/* Profile Info */}
                  <Col className="d-flex flex-column align-items-center align-items-lg-start">
                    <h3>{profile.name}</h3>
                    <p className="mb-1 w-fit">
                      {[...Array(profile.rating)].map((_, i) => (
                        <StarFilledIcon key={i} />
                      ))}
                    </p>
                    <p className="mb-0 w-fit">{profile.reviewCount} Reviews</p>
                  </Col>
                  {/* Details */}
                  <Col className="mt-2">
                    {/* Details */}
                    <div className="info-line">
                      <RoleIcon />
                      <p className="ms-2 mb-0">{profile.role}</p>
                    </div>
                    <div className="info-line">
                      <JobsCheckIcon />
                      <p className="ms-2 mb-0">{profile.jobsDone} jobs</p>
                    </div>
                    <div className="info-line">
                      <MapPinIcon />
                      <p className="ms-2 mb-0">{profile.location}</p>
                    </div>
                    {profile.verifiedID && (
                      <div className="info-line">
                        <IdentificationIcon />
                        <p className="ms-2 mb-0">ID Verified</p>
                      </div>
                    )}
                    {profile.drivingLicense && (
                      <div className="info-line">
                        <GrLicense className="heroicon driving-icon" />
                        <p className="ms-2 mb-0">Driving license</p>
                      </div>
                    )}
                  </Col>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Profile about */}
        <Col className="">
          <p className="no-text-select">{profile.about}</p>
        </Col>
      </Row>

      {/* Review Form */}
      <Card className="mt-3">
        <Card.Header className="text-center fs-5">Post a review</Card.Header>
        <Card.Body className="pt-1">
          <Form method="post">
            <label className="mt-2 mb-3">
              <input
                type="checkbox"
                className="btn-check"
                name="rating"
                value={rating}
                autoComplete="off"
              />
              <div className="star-wrapper">
                {[...Array(5)].map((_, value) => (
                  <button
                    type="button"
                    key={value}
                    className="btn p-0"
                    onMouseEnter={() => setMouseRating(value + 1)}
                    onMouseLeave={() => setMouseRating(rating)}
                    onClick={() => setRating(value + 1)}
                  >
                    {value + 1 <= mouseRating ? <StarFilledIcon /> : <StarOutlineIcon />}
                  </button>
                ))}
              </div>
            </label>
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a review"
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.currentTarget.value)}
                style={{ height: "7rem" }}
              />
              <label htmlFor="review">write review</label>
            </div>
            <div className="review-btn-wrap d-flex justify-content-center gap-2 m-auto mt-3">
              <button type="submit" className="btn btn-primary rounded-pill flex-grow-1">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-pill flex-grow-1"
                onClick={() => {
                  setRating(0);
                  setMouseRating(0);
                  setReviewText("");
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="divider mt-3"></div>
      {/* Reviews */}
      <div>
        <p className="display-6 mt-4">Reviews</p>
        {[...Array(3)].map((_, i) => (
          <Card as="article" key={i} className="mt-3">
            {/* Header */}
            <Card.Header>
              <div className="d-flex align-items-center">
                <span className="d-inline-block fs-6 fw-semibold me-3">Reviewer</span>

                {[...Array(5)].map((_, i) => (
                  <StarFilledIcon key={i} />
                ))}
              </div>
            </Card.Header>
            {/* Body */}
            <Card.Body>
              <Card.Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat pariatur facilis
                perspiciatis sunt sed, vitae ad officiis laboriosam unde, temporibus tempora nemo
                velit mollitia earum assumenda minus voluptatum quod facere.
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
}
