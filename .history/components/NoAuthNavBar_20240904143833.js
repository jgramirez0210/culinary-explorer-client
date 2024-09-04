import React from 'react';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import Link from 'next/link';
import { signOut } from '../utils/auth';

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
            <Link passHref href="/">
              <Nav.Link as="a">Home</Nav.Link>
            </Link>
            <Link passHref href="/delete-me">
              <Nav.Link as="a">Food Map</Nav.Link>
            </Link>
            <Button type="button" size="lg" className="copy-btn" onClick={signIn}>
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
