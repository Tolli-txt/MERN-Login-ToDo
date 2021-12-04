import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <h2>404: Page not found</h2>

    <Link to="/" className="button">Go home</Link>
  </>
);

export default NotFound;
