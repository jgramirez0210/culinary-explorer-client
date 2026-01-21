import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import { signIn } from '../utils/auth';

export default function NoAuthNavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>Culinary Explorer</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/restaurant_map/restaurant_map">
              Food Map
            </Nav.Link>
            <Button type="button" size="lg" className="copy-btn" onClick={signIn}>
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
