import React from "react";
import PropTypes from 'prop-types';
import Img from 'react-image'
import './Annotation.css';

const Annotation = ({url}) => {
  return <div className="annotation-container">
    <Img
      src={[url, '/missing_image_symbol.png']}
      alt='item to label'
      className="full-img"
      // loader={CircularProgress}
    />
  </div>
};

Annotation.defaultProps = {
  url: '/missing_image_symbol.png'
};

Annotation.propTypes = {
  url: PropTypes.string
};

export default Annotation;
