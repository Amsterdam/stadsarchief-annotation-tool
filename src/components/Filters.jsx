import React from "react";
import PropTypes from 'prop-types';
import './Filters.css';

class Filter extends React.Component {
  // example option for single filter:
  // * specific value: apple/pear
  // * limit filter to undefined elements: <empty>
  // * Don't apply filter: ""

  render() {
    const {label, values} = this.props;
    return (
      <div>
        <label>
          {label}
          <select>
          {/*<select value={item && item.document_type || ''} onChange={this._onSelectChange.bind(this)}>*/}
            { values.map((value) => <option key={value || '__empty'} value={value}>{value}</option>) }
          </select>
        </label>
      </div>
      );
  }
}

class Filters extends React.Component {
  componentDidMount() {
    const { availableFilters } = this.props;
    this.setState({
      active: {

      }
    })
  }

  render() {
    const { availableFilters } = this.props;
    const list = Object.entries(availableFilters);
    return <div className="filters">
      <form>
        <h3>Filters</h3>
        { list.map(([label, values]) => <Filter key={label} label={label} values={values} />) }
      </form>
    </div>
  }
}

Filters.defaultProps = {
  // url: 'https://www.amsterdam.nl/publish/pages/858225/logo.png'
};

Filters.propTypes = {
  availableFilters: PropTypes.object.isRequired
};

export default Filters;
