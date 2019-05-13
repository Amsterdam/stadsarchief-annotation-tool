import React from 'react';
import Annotation from "./Annotation";

const API_ROOT = 'http://localhost:5000/';

const getAnnotationList = () => {
  const url = API_ROOT;
  return fetch(url)
    .then(data => data.json());
};

const putAnnotation = (index, value) => {
  const url = `${API_ROOT}put/${index}`;
  const data = JSON.stringify({ "document_type": value});
  console.log(data);
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
    const { items, currentIndex } = this.state;
    putAnnotation(currentIndex, newValue).then(() => {
      const item = items[currentIndex];
      item.document_type = newValue;
      items[currentIndex] = item;
      this.setState({ items });
    }).catch(e => console.error(e));
  }

  componentDidMount() {
    getAnnotationList().then(items => {
      const currentIndex = 800;
      this.setState({
        items,
        currentIndex,
      })
    });

    document.addEventListener('keyup', (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const key = event.key || event.keyCode;

      const { items } = this.state;

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

      if (key === 'a') {
        this._updateType('aanvraag');
      }

      if (key === 'b') {
        this._updateType('besluit');
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
          <li><span>Total </span><span>{items && items.length}</span></li>
          <li><span>Document_type </span><span>{item && item.document_type}</span></li>
        </ul>
      </div>
      { item && <Annotation item={item}/>}
    </div>;
  }
}

export default Annotator;
