import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Annotator from './components/Annotator';
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div>
        <nav className="top-navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/annotator/">Annotator</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Home} />
        <Route path="/annotator/" component={Annotator} />
      </div>
    </Router>

  );
}

export default App;
