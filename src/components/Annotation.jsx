import React from "react";
import PropTypes from 'prop-types';
import './Annotation.css';

const Annotation = ({url}) => {
  return <div className="annotation-container">
    <img src={url} alt='item to label' className="full-img"/>
  </div>
};

Annotation.defaultProps = {
  url: 'https://www.amsterdam.nl/publish/pages/858225/logo.png'
};

Annotation.propTypes = {
  url: PropTypes.string
};

export default Annotation;
