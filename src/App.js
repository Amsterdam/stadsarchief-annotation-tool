import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import SingleExample from "./pages/SingleExample";
import ExamplesGrid from "./pages/ExamplesGrid";

function App() {
  return (
    <Router>
      <div>
        <nav className="top-navigation">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/grid">Grid</Link></li>
            <li><Link to="/annotator/">Annotator</Link></li>
          </ul>
        </nav>

        <Route path="/" exact component={Home} />
        <Route path="/grid/" component={ExamplesGrid} />
        <Route path="/annotator/" component={SingleExample} />
      </div>
    </Router>

  );
}

export default App;
