import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import Annotator from './components/Annotator';


function Index() {
  return <h2>Home</h2>;
}

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

        <Route path="/" exact component={Index} />
        <Route path="/annotator/" component={Annotator} />
      </div>
    </Router>

  );
}

export default App;
