import { Col, Container, Row } from "react-bootstrap";
import { Link, useRouteLoaderData } from "react-router-dom";
import img1 from "../assets/laborer1.jpg";
import img2 from "../assets/laborer2.png";
import worker_illustration from "../assets/worker-illustration.jpg";
import { RootLoaderData } from "./Root";
import { WorkersSearchForm } from "./find-workers/WorkerSearch";

type WorkerSearchParams = {
  [k in keyof WorkersSearchForm]?: string;
};

export default function Home() {
  const roles = useRouteLoaderData("root") as RootLoaderData;

  const roleLinks = roles.map((role) => {
    const link = new URLSearchParams({
      selectedRoles: role,
    } satisfies WorkerSearchParams).toString();

    return (
      <Link to={`find-workers?${link}`} className="btn role" key={role}>
        {role}
      </Link>
    );
  });

  return (
    <Container as="main" className="homepage mb-3 p-0">
      <Row as="article" className="home-main">
        {/* Headline */}
        <Col className="headline-wrapper">
          <p>Solution helps people get jobs and companies their projects done</p>
        </Col>
        {/* Images */}
        <Col className="main-img-wrapper">
          <img className="rounded upper-img" src={img1} alt="laborer1" width={1200} height={600} />
          <img className="rounded lower-img" src={img2} alt="laborer2" width={973} height={781} />
        </Col>
      </Row>
      <Row as="article" className="home-worker row mt-3">
        {/* Text */}
        <Col
          as="section"
          className="text-side flex-grow-1 d-flex flex-column text-center text-md-start p-0 mx-3"
        >
          <h1>For Workers</h1>
          <h3>Choose how you work</h3>
          <p>
            Sign up with your work preferences and matching job opportunities will be sent to you.
          </p>
          {/* Buttons */}
          <div className="buttons">
            <a href="/register" className="btn left flex-grow-1">
              Become a Solutioneer
            </a>
            <Link to="/find-jobs" className="btn right flex-grow-1">
              View Latest Jobs Postings
            </Link>
          </div>
        </Col>
        {/* Right side image */}
        <Col as="figure">
          <img src={worker_illustration} alt="worker illustration" width={2000} height={2000} />
          <figcaption></figcaption>
        </Col>
      </Row>
      <Row as="article" className="home-enterprise mt-3 mx-3 mx-md-0">
        <Col sm={12} md={6} className="text-sidetext-center text-md-start p-0">
          <h1>Skilled Workers</h1>
          <p>Find the workers you need in the following roles.</p>
        </Col>
        <Col className="d-flex flex-wrap gap-2 p-0">{roleLinks}</Col>
      </Row>
    </Container>
  );
}
