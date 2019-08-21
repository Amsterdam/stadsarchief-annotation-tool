import React from "react";
import PropTypes from 'prop-types';
import Img from 'react-image'
import './Annotation.css';

const Annotation = ({url}) => {
  return <div className="annotation-container">
    <Img
      src={[url, '/missing_image_symbol_large.png']}
      alt='item to label'
      className="full-img"
    />
  </div>
};

Annotation.defaultProps = {
  url: '/missing_image_symbol_large.png'
};

Annotation.propTypes = {
  url: PropTypes.string
};

export default Annotation;
