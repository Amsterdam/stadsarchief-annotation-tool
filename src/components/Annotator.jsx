import React from 'react';
import Annotation from "./Annotation";


const hostname = window.location.hostname;
const API_ROOT = `http://${hostname}:5000/`;

const availableTypes = [
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

const getAnnotationList = () => {
  const url = API_ROOT;
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

const saveData = () => {
  const url = `${API_ROOT}save`;
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PUT'
  })
    .then(response => response.json())
};

class Annotator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  _updateType(newValue) {
    if (newValue.length > 0 && availableTypes.indexOf(newValue) < 0) {
      throw new Error(`unkown type!: ${newValue}`);
    }
    const { items, currentIndex } = this.state;
    putAnnotation(currentIndex, newValue).then(() => {
      const item = items[currentIndex];
      item.document_type = newValue;
      items[currentIndex] = item;
      this.setState({ items });
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

  _onBlur(event) {
    const value = event.target.value;
    event.target.value= "";

    if (value >= 0 && value < this.state.items.length) {
      this.setState({ currentIndex: value });
    }
  }

  componentDidMount() {
    getAnnotationList().then(items => {
      const currentIndex = 800;
      this.setState({
        items,
        currentIndex,
      })
    });

    const element = document;
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

      const { items, currentIndex } = this.state;
      const item = items && items[currentIndex];

      if (key === 'Enter') {
        console.log('saving');
        saveData().then(() => console.log('done saving'));
      }
      if (key === 'ArrowLeft') {
        this.setState({ currentIndex: Math.max(this.state.currentIndex - 1, 0) })
      }
      if (key === ' ' || key === 'ArrowRight') {
        this.setState({ currentIndex: Math.min(this.state.currentIndex + 1, items.length) })
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
    const { currentIndex, items } = this.state;
    const item = items && items[currentIndex];
    return <div>
      <div className="overlay">
        <ul>
          <li><span>Current </span><span>{currentIndex}</span></li>
            {/*, jump to: <input type="number" min="0" onBlur={this._onBlur.bind(this)} /></li>*/}
          <li><span>Total </span><span>{items && items.length}</span></li>
          <li><span>Document_type </span><span>{item && item.document_type}</span></li>
        </ul>
      </div>
      <div ref={elem => this.annotationContainer = elem}>
        { item && <Annotation item={item}/>}
      </div>
    </div>;
  }
}

export default Annotator;
