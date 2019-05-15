import React from 'react';
import Annotation from "./Annotation";

const startIndex = 1022;

const hostname = window.location.hostname;
const API_ROOT = `http://${hostname}:5000/`;

const availableTypes = [
  '',
  'aanvraag',
  'besluit',
  'correspondentie',
  'aanpassing',
  'aanvraag revisie',
  'bijlage',
  'bijlage aanvraag',
  'bijlage vergunning',
  'bijlage beschikking',
  'aansluitvoorschriften',
  'vergunning',
  'zienswijze',
  // 'bijlage bij beschikking',
];

const getAnnotationCount = () => {
  const url = API_ROOT;
  return fetch(url)
    .then(data => data.json());
};

const getAnnotation = (index) => {
  const url = `${API_ROOT}${index}`;
  return fetch(url)
    .then(data => data.json());
};

const putAnnotation = (index, value) => {
  const url = `${API_ROOT}put/${index}`;
  const data = JSON.stringify({ "document_type": value});
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: data
  })
    .then(response => response.json())
};

// const saveData = () => {
//   const url = `${API_ROOT}save`;
//   return fetch(url, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     method: 'PUT'
//   })
//     .then(response => response.json())
// };

class Annotator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    }
  }

  _changeAnnotation(index) {
    this.setState({
      isLoading: true
    });
    getAnnotation(index).then(item => {
      console.log(item);
      this.setState({
        item,
        currentIndex: index,
        isLoading: false
      })
    });
  }

  _updateType(newValue) {
    if (newValue.length > 0 && availableTypes.indexOf(newValue) < 0) {
      throw new Error(`unkown type!: ${newValue}`);
    }
    const { item, currentIndex } = this.state;
    putAnnotation(currentIndex, newValue).then(() => {
      item.document_type = newValue;
      this.setState({ item });
    }).catch(e => console.error(e));
  }

  _changeType(currentValue, direction) {
    const idx = availableTypes.indexOf(currentValue);
    if (idx >= 0) {
      const type = availableTypes[(availableTypes.length + idx + direction) % availableTypes.length];
      this._updateType(type)
    } else {
      this._updateType(availableTypes[0])
    }
  }

  _onSelectChange(event) {
    this._updateType(event.target.value)
  }

  _onBlur(event) {
    const value = event.target.value;
    event.target.value= "";
    const index = parseInt(value, 10);

    if (index >= 0 && index < this.state.count) {
      this._changeAnnotation(index)
    }
  }

  componentDidMount() {
    getAnnotationCount().then(data => {
      this.setState({
        count: data.count,
        isLoading: true
      });
      this._changeAnnotation(startIndex);
    });

    // const element = document;
    const element = this.annotationContainer;
    element.focus();
    element.addEventListener('keydown', (event) => {
      const key = event.key || event.keyCode;
      if (key === ' ') {
        event.preventDefault();
        return false; // Prevent page scroll from space key
      }
    });

    element.addEventListener('keyup', (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const key = event.key || event.keyCode;

      const { item, count, currentIndex } = this.state;

      // if (key === 'Enter') {
      //   console.log('saving');
      //   saveData().then(() => console.log('done saving'));
      // }
      if (key === 'ArrowLeft') {
        this._changeAnnotation(Math.max(currentIndex - 1, 0));
      }
      if (key === ' ' || key === 'ArrowRight') {
        this._changeAnnotation(Math.min(currentIndex + 1, count));
      }

      if (item) {
        if (key === 'Escape') {
          this._updateType('');
        }
        if (key === '+' || key === '=' | key === ',') {
          this._changeType(item.document_type, 1);
        }

        if (key === '-' || key === '.') {
          this._changeType(item.document_type, -1);
        }

        if (key === 'a') {
          this._updateType('aanvraag');
        }

        if (key === 'b') {
          this._updateType('besluit');
        }

        let keyCode = event.keyCode;
        if (keyCode >= 49 && keyCode <= 57) {
          // numerical 1 through 9
          const idx = keyCode - 49; // key 1 -> index 0
          this._updateType(availableTypes[idx]);
        }
      }

    });
  }

  render(){
    const { item, isLoading, count, currentIndex } = this.state;
    return <div>
      <div className="overlay">
        <ul>
          <li><span>Current </span><span>{currentIndex}, jump to: </span><input type="number" min="0" onBlur={this._onBlur.bind(this)} /></li>
          <li><span>Total </span><span>{count}</span></li>
          <li><span>Document_type </span><span>{item && item.document_type}</span></li>
          <li>
            <label>
              Document_type:
              <select value={item && item.document_type || ''} onChange={this._onSelectChange.bind(this)}>
                { availableTypes.map((type) => <option key={type} value={type}>{type}</option>) }
              </select>
            </label>
          </li>
        </ul>
      </div>
      { isLoading && <div className="loading-icon"><i className="fa fa-circle-o-notch fa-spin fa-3x"></i></div> }
      <div tabIndex="0" ref={elem => this.annotationContainer = elem}>
        {!isLoading && item && <Annotation item={item}/>}
      </div>
    </div>;
  }
}

export default Annotator;
