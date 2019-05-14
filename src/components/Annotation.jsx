import React from "react";

const Annotation = ({item}) => {
  // console.log(item);
  const url = item.iiif_url || 'https://www.amsterdam.nl/publish/pages/858225/logo.png';
  // const url = 'https://www.amsterdam.nl/publish/pages/858225/logo.png';

  return <img src={url} alt='item to label' className="full-img"/>
};

export default Annotation;
