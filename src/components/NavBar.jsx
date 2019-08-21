
import React from "react";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const NavBar = () => {

  return (
      <nav className="top-navigation">

        <ul>
          <li><Link component={RouterLink} to="/">Home</Link></li>
          <li><Link component={RouterLink} to="/grid">Grid</Link></li>
          <li><Link component={RouterLink} to="/annotator">Annotator</Link></li>
        </ul>
      </nav>
  )
};

export default NavBar;
