import React from 'react';
import Annotation from "./Annotation";
import {getAnnotation, getBakedUrl, getExamplesId, getLocalUrl, putAnnotation} from "../api";
import get from 'lodash.get';
import NotificationArea from "./NotificationArea";

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
  'other',
];

class Annotator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      useLocalImages: false
    };

    this._changeImageSource = this._changeImageSource.bind(this);

  }

  _addNotification(id, message) {
    const notifications = [
      {
        id,
        message
      }
    ];
    this.setState({
      notifications
    })
  }

  _loadCurrentAnnotation() {
    const { currentId } = this.state;
    this.setState({
      item: undefined,
      isLoading: true
    });
    getAnnotation(currentId).then(item => {
      console.log(item);
      this.setState({
        item,
        isLoading: false
      })
    });
  }

  _changeAnnotation(index) {
    const { ids } = this.state;

    if (index < 0 || index >= ids.length) {
      console.warn(`index outside of range: ${index}`);
    } else {
      const id = ids[index];

      this.setState({
        currentIndex: index,
        currentId: id
      });

      this._loadCurrentAnnotation();
    }
  }

  _updateType(newValue) {
    if (newValue.length > 0 && availableTypes.indexOf(newValue) < 0) {
      throw new Error(`unknown type!: ${newValue}`);
    }
    const { item } = this.state;
    item.meta.type = newValue;
    this.setState({
      item
    });
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

  async _commitChanges() {
    const { currentId, item } = this.state;
    const { meta } = item;
    meta.checked = true;
    await putAnnotation(currentId, meta);
    this._loadCurrentAnnotation(); // reload
    this._addNotification(currentId, `${currentId} -> ${meta.type}`);
  }

  // _onSelectChange(event) {
  //   this._updateType(event.target.value)
  // }
  //
  // _onBlur(event) {
  //   const value = event.target.value;
  //   event.target.value= "";
  //   const index = parseInt(value, 10);
  //
  //   if (index >= 0 && index < this.state.count) {
  //     this._changeAnnotation(index)
  //   }
  // }

  _changeImageSource(e) {
    this.setState({
      useLocalImages: e.target.value === 'localhost'
    })
  }

  componentDidMount() {
    getExamplesId().then(ids => {
      this.setState({
        ids
      });

      this._changeAnnotation(0);
    });

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

      const { item, currentIndex } = this.state;

      if (key === 'ArrowLeft') {
        this._changeAnnotation(currentIndex - 1);
      }
      if (key === 'ArrowRight') {
        this._changeAnnotation(currentIndex + 1);
      }
      if (key === ' ') {
        this._commitChanges();
        this._changeAnnotation(currentIndex + 1);
      }

      if (item) {
        if (key === 'Escape') {
          this._updateType('');
        }
        if (key === '+' || key === '=' | key === ',') {
          this._changeType(item.meta.type, 1);
        }

        if (key === '-' || key === '.') {
          this._changeType(item.meta.type, -1);
        }

        if (key === 'a') {
          this._updateType('aanvraag');
          this._commitChanges();
          this._changeAnnotation(currentIndex + 1);
        }

        if (key === 'b') {
          this._updateType('besluit');
          this._commitChanges();
          this._changeAnnotation(currentIndex + 1);
        }

        if (key === 'o' || key === 'z') {
          this._updateType('other');
          this._commitChanges();
          this._changeAnnotation(currentIndex + 1);
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

  render() {
    const { currentId, currentIndex, ids, isLoading, item, useLocalImages, notifications } = this.state;
    const count = ids && ids.length;
    let url;
    if (item) {
      if (useLocalImages) {
        url = getLocalUrl(item.meta);
      } else {
        url = getBakedUrl(item);
      }
    }

    return <div>
      <div className="overlay controls">
        <form>
          <div className="radio">
            <label>
              <input type="radio" value="localhost" checked={useLocalImages} onChange={this._changeImageSource}/>
              localhost:6543
            </label>
          </div>
          <div className="radio">
            <label>
              <input type="radio" value="api" checked={!useLocalImages} onChange={this._changeImageSource}/>
              API defined
            </label>
          </div>
        </form>
      </div>

      <div className="overlay info">
        <ul>
          <li><span className='label'>Current</span>{currentId}</li>
          {/*<li><span className='label'>Current </span><span>{currentId}, jump to: </span><input type="number" min="0" onBlur={this._onBlur.bind(this)} /></li>*/}
          <li><span className='label'>Index</span> {currentIndex}, out of {count} items</li>
          <li><span className='label'>Name</span><span>{get(item, 'meta.reference')}</span></li>
          <li><span className='label'>Checked</span><span>{String(get(item, 'meta.checked'))}</span></li>
          <li><span className='label'>Document_type</span><span>{get(item, 'meta.type')}</span></li>
          {/*<li>*/}
            {/*<label>*/}
              {/*Document_type:*/}
              {/*<select value={item && item.document_type || ''} onChange={this._onSelectChange.bind(this)}>*/}
                {/*{ availableTypes.map((type) => <option key={type} value={type}>{type}</option>) }*/}
              {/*</select>*/}
            {/*</label>*/}
          {/*</li>*/}
        </ul>
      </div>

      <div className="overlay shortcuts">
        <ul>
          <li><span className='label'>Commit</span>space bar</li>
          <li><span className='label'>Prev/next</span>left/right arrow</li>
          <li><span className='label'>Clear type</span>escape</li>
          <li><span className='label'>Aanvraag</span>a</li>
          <li><span className='label'>Besluit</span>b</li>
          <li><span className='label'>Other</span>z / o</li>
        </ul>
      </div>

      <div className="bottom-left">
        <NotificationArea notifications={notifications} />
      </div>

      { isLoading && <div className="loading-icon"><i className="fa fa-circle-o-notch fa-spin fa-3x"></i></div> }
      <div tabIndex="0" ref={elem => this.annotationContainer = elem}>
        {!isLoading && url && <Annotation url={url}/>}
      </div>
    </div>;
  }
}

export default Annotator;
