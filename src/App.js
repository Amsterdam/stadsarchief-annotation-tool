import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import SingleExample from "./pages/SingleExample";
import ExamplesGrid from "./pages/ExamplesGrid";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <div>
        <NavBar />

        <Route path="/" exact component={Home} />
        <Route path="/grid/" component={ExamplesGrid} />
        <Route path="/annotator/" component={SingleExample} />
      </div>
    </Router>

  );
}

export default App;
