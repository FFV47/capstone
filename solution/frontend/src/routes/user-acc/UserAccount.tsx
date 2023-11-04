import { Accordion, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

export default function UserAccount() {
  const CustomAccordionItem = ({
    eventKey,
    title,
    children,
  }: {
    eventKey: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body className="p-0">
        <ListGroup variant="flush">{children}</ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );

  const LinkItem = ({ to, text }: { to: string; text: string }) => (
    <ListGroup.Item className="p-1">
      <Link to={to} className="btn btn-outline-light-dark d-block stretched-link text-start">
        {text}
      </Link>
    </ListGroup.Item>
  );

  return (
    <Container as="main" className="mt-2 flex-grow-1">
      <h1 className="text-center">Account Management</h1>
      <Row xs={12} md={4}>
        <Col xs={12} md={4}>
          <Accordion>
            <CustomAccordionItem eventKey="0" title="Dashboard">
              <LinkItem to="info" text="Account info" />
              <LinkItem to="change-password" text="Change password" />
            </CustomAccordionItem>

            <CustomAccordionItem eventKey="1" title="Account info">
              <LinkItem to="info" text="Account info" />
            </CustomAccordionItem>
          </Accordion>
        </Col>
        <Col xs={12} md={8} className="mt-2">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
