import React from "react";
import PropTypes from 'prop-types';
import './AnnotationList.css';
import Paper from "@material-ui/core/Paper/Paper";

const AnnotationList = ({annotations}) => {
  return <Paper className="annotation-list">
    Annotation list
  </Paper>
};

AnnotationList.defaultProps = {
};

AnnotationList.propTypes = {
  annotations: PropTypes.array
};

export default AnnotationList;
