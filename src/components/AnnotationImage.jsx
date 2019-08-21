import React, {useState} from "react";

import Img from 'react-image'
import VisibilitySensor from 'react-visibility-sensor'

export default ({url}) => {
  const [wasVisible, setVisible] = useState(false);

  const onChange = (nowVisible) => {
    if (nowVisible) { // Note, will not be switched to false again
      setVisible(true);
    }
  };

  return (
    <VisibilitySensor onChange={onChange}>
      <div>
        { wasVisible && <Img
          src={[url, '/missing_image_symbol.png']}
          alt='item to label'
          className="full-img"
          loading="lazy"
        />}
        <div>&nbsp;</div> { /* Required for visiblity sensor to trigger*/}
      </div>
    </VisibilitySensor>
  )
}


//
