import React from "react";
import PropTypes from 'prop-types';
import Notification from "./Notification";
import './NotificationArea.css';

const NotificationArea = ({notifications}) => {
  return <div className="notification-area">
    { notifications.map( note => <Notification key={note.id} message={note.message}/>) }
  </div>
};

NotificationArea.defaultProps = {
  notifications: []
};

NotificationArea.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    })
  )
};

export default NotificationArea;
