import { Link } from "react-router-dom";
import { djangoUserData } from "../django";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function NavBar() {
  const { authenticated, hasAccount } = djangoUserData;

  return (
    <Navbar
      expand="md"
      sticky="top"
      data-bs-theme="dark"
      className="main-navbar mx-md-3 mb-3 shadow"
    >
      <Container fluid>
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          Solution
        </Link>

        {/* Expand button */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Nav links */}
        <Navbar.Collapse id="main-navbar" className="justify-content-between">
          <Nav>
            <Link to="/find-jobs" className="nav-link text-center">
              Find Jobs
            </Link>
            <Link to="/find-workers" className="nav-link text-center">
              Find Workers
            </Link>
          </Nav>
          {/* Django paths */}
          <Nav>
            {/* <button className="nav-link text-center">Sticky</button> */}
            {authenticated ? (
              <>
                <Link to={hasAccount ? "/user" : "/setup-account"} className="nav-link text-center">
                  My Account
                </Link>
                <Nav.Link href="/logout" active className="text-center">
                  Log Out
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/register" active>
                  Sign Up
                </Nav.Link>
                <Nav.Link href="/login">Log In</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
