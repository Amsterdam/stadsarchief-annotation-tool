import Button from "@material-ui/core/Button/Button";
import React from "react";
import { connect } from 'react-redux'
import {fetchExamples} from "../store/examples";

const mapState = (state) => {
  return {

  }
};
const mapDispatch = { fetchExamples };

const HomePage = ({ fetchExamples }) => {
  return (
    <div>
      <Button variant="contained" color="primary" onClick={(e) => { e.preventDefault(); fetchExamples({ value: 'empty' }) } }>
        Hello World
      </Button>
    </div>
  );
};

export default connect(
  mapState,
  mapDispatch
)(HomePage);
