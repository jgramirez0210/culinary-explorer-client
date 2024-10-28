import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Button,
  Form,
  FormControl,
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Link href="/" className="navbar-brand">
          Culinary Explorer
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link href="/food_log/new" className="nav-link">
              Add To Food Log
            </Link>
            <Link href="/food_map/food_map" className="nav-link">
              Food Map
            </Link>
            <Button variant="danger" onClick={signOut}>
              Sign Out
            </Button>
          </Nav>
          <Form className="d-flex" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
