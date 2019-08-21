import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const HomePage = () => {
  return (
    <div>
      <h1>Annotation tool</h1>

      <Link component={RouterLink} to="/grid">
        Grid
      </Link>
    </div>
  );
};

export default HomePage
