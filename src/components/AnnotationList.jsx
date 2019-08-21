import React from "react";
import PropTypes from 'prop-types';
import './AnnotationList.css';

const AnnotationList = ({annotations}) => {
  console.log(annotations);
  return <div className="annotation-list">
    Annotation list
  </div>
};

AnnotationList.defaultProps = {
  // url: 'https://www.amsterdam.nl/publish/pages/858225/logo.png'
};

AnnotationList.propTypes = {
  annotations: PropTypes.array
};

export default AnnotationList;
