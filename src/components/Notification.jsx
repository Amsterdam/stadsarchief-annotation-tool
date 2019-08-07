import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Notification.css';



const Notification = ({message}) => {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return <div className={classNames('notification', { hide: hidden })}>
    {message}
  </div>
};

Notification.propTypes = {
  message: PropTypes.string.isRequired
};

export default Notification;
