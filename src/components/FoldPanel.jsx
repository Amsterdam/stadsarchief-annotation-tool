import React from "react";

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import './FoldPanel.css';
import IconButton from "@material-ui/core/IconButton/IconButton";

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
    const {children} = this.props;
    const { isOpen } = this.state;
    const header = children.find(child => child.type === Header);
    const body = children.find(child => child.type === Body);
    const panelName = header.props.children;
    return <div className="fold-panel">
      <div className="panel">
        <header onClick={this._toggle} title={isOpen ? `close ${panelName}` : `open ${panelName}`}>
          <IconButton className="toggle-icon">
            { isOpen ? <ExpandLessIcon /> : <ChevronRightIcon /> }
          </IconButton>

          { isOpen &&
          <div className="header-content">
            {header ? header.props.children : null}
          </div>
          }
        </header>
        <main>
          {isOpen &&
            <div className="header-body">
              {body ? body.props.children : null}
            </div>
          }
        </main>
      </div>
    </div>
  }
}

export default FoldPanel;
