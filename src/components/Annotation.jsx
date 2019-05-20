import React from "react";
import PropTypes from 'prop-types';

const Annotation = ({url}) => {
  return <img src={url} alt='item to label' className="full-img"/>
};

Annotation.defaultProps = {
  url: 'https://www.amsterdam.nl/publish/pages/858225/logo.png'
};

Annotation.propTypes = {
  url: PropTypes.string
};

export default Annotation;
