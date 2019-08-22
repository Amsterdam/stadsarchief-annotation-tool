import React from "react";
import PropTypes from 'prop-types';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import './FoldPanel.css';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper/Paper";
import Divider from "@material-ui/core/Divider/Divider";

function Header() {
  return null
}

function Body() {
  return null
}

class FoldPanel extends React.Component {
  static Header = Header;
  static Body = Body;

  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
    };

    this._toggle = this._toggle.bind(this);
  }

  _toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const {children, direction} = this.props;
    const { isOpen } = this.state;
    const header = children.find(child => child.type === Header);
    const body = children.find(child => child.type === Body);
    const panelName = header.props.children;
    const DirectionIcon = direction === 'left' ? ChevronRightIcon : ChevronLeftIcon;
    return <div className="fold-panel">
      <Paper>
        <header onClick={this._toggle} title={isOpen ? `close ${panelName}` : `open ${panelName}`}>
          <IconButton className="toggle-icon">
            { isOpen ?
              <ExpandLessIcon /> : <DirectionIcon /> }
          </IconButton>

          { isOpen &&
          <div className="header-content">
            {header ? header.props.children : null}
          </div>
          }
        </header>
        { isOpen && <Divider /> }
        <main>
          {isOpen &&
            <div className="header-body">
              {body ? body.props.children : null}
            </div>
          }
        </main>
      </Paper>
    </div>
  }
}

FoldPanel.defaultProps = {
  direction: 'right'
};

FoldPanel.propTypes = {
  direction: PropTypes.string
};

export default FoldPanel;
