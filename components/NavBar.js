import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav,
  Button,
} from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>Culinary Explorer</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link passHref href="/food_log/new">
              <Nav.Link as="a">Add To Food Log</Nav.Link>
            </Link>
            <Link passHref href="/food_map/food_map">
              <Nav.Link as="a">Food Map</Nav.Link>
            </Link>
            <Button variant="danger" onClick={signOut}>
              Sign Out
            </Button>
          </Nav>
          <form className="custom-search-form" role="search" onSubmit={handleSearchSubmit}>
            <input
              className="custom-search-input"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="custom-search-button" type="submit">
              Search
            </button>
          </form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
