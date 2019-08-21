import React from 'react';
import Annotation from './Annotation';
import classNames from 'classnames';
import get from 'lodash.get';
import {getAnnotation, getBakedUrl, getExamplesList, getLocalUrl, putAnnotation} from '../api/generic_api';
import NotificationArea from './NotificationArea';
import './Annotator.css';
import AnnotationList from "./AnnotationList";
import Filters from "./Filters";
import FoldPanel from "./FoldPanel";

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
      useLocalImages: true,
      showLabel: true,
      showPrediction: false
    };

    this._changeImageSource = this._changeImageSource.bind(this);
    this._changeHighlight = this._changeHighlight.bind(this);
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

  _loadAnnotation(url) {
    this.setState({
      item: undefined,
      isLoading: true
    });
    return getAnnotation(url).then(item => {
      this.setState({
        item,
        isLoading: false
      });

      // Code to skip to desired type (or other meta property)
      // if (item.meta.type !== 'aanvraag') { // Jump to next aanvraag
      // // if (item.meta.type !== 'unknown') {
      // if (item.meta.prediction == undefined || item.meta.checked) { // Find unannotated prediction
      // if (item.meta.prediction != 'aanvraag') { // Find next aanvraag prediction
      // if (item.meta.prediction != 'aanvraag' || item.meta.checked) { // Find unannotated prediction of aanvraag
      // if (item.meta.prediction == item.meta.type) { // Jump to next wrong prediction
      //   console.count('next');
      //   const { currentIndex } = this.state;
      //   this._changeAnnotation(currentIndex + 1)
      // }
    });
  }

  _changeAnnotation(index) {
    const { count, examples } = this.state;

    if (index < 0 || index >= count) {
      console.warn(`index outside of range: ${index}`);
    } else {
      const example = examples[index];

      this.setState({
        currentIndex: index,
        currentId: example.id
      });

      this._loadAnnotation(example._links.self.href);
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
    await this._loadAnnotation(currentId); // reload
    this._addNotification(currentId, `${currentId} -> ${meta.type}`);
  }

  // _onSelectChange(event) {
  //   this._updateType(event.target.value)
  // }

  _onInfoSubmit(event) {
    event.preventDefault();
    let inputElement = event.target.querySelector('input[name="idx"]');
    const value = inputElement.value;
    inputElement.value = ""; // clear input field

    const index = parseInt(value, 10);

    if (index >= 0 && index < this.state.count) {
      this._changeAnnotation(index)
    }
  }

  _changeImageSource(e) {
    this.setState({
      useLocalImages: e.target.value === 'localhost'
    })
  }

  _changeHighlight(e) {
    this.setState({
      showLabel: e.target.value === 'label',
      showPrediction: e.target.value === 'prediction'
    })
  }

  _addListeners(element) {
    element.addEventListener('keydown', (event) => {
      const key = event.key || event.keyCode;
      if (key === ' ') {
        event.preventDefault();
        return false; // Prevent page scroll from space key
      }
    });

    element.addEventListener('keyup', async (event) => {
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
        await this._commitChanges();
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
          await this._commitChanges();
          this._changeAnnotation(currentIndex + 1);
        }

        if (key === 'b') {
          this._updateType('besluit');
          await this._commitChanges();
          this._changeAnnotation(currentIndex + 1);
        }

        if (key === 'o' || key === 'z') {
          this._updateType('other');
          await this._commitChanges();
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

  componentDidMount() {
    getExamplesList().then(examples => {
      this.setState({
        count: examples.length,
        examples
      });

      this._changeAnnotation(0);
    });

    const element = this.annotationContainer;
    element.focus();

    this._addListeners(element)
  }

  render() {
    const availableFilters = {
      type: ['aanvraag', 'besluit', undefined],
      stadsdeel: ['SA', 'SU', 'ST', undefined]
    };

    const { count, currentId, currentIndex, isLoading, item, useLocalImages, notifications, showLabel, showPrediction } = this.state;
    let url;
    if (item) {
      if (useLocalImages) {
        url = getLocalUrl(item.tags);
      } else {
        url = getBakedUrl(item.tags);
      }
    }

    const reference = get(item, 'meta.reference');
    const type = get(item, 'meta.type');
    const dashedType = type && type.replace(/\s+/g, '-');
    const noType = reference && (type === '' || type === undefined);
    const hasPrediction = item && item.meta && typeof item.meta.prediction !== 'undefined';
    const prediction = get(item, 'meta.prediction');
    const confidence = get(item, 'meta.confidence');

    return <div className="annotator">
      {/*<div className="overlay controls">*/}
        {/*<form>*/}
          {/*<div>Host</div>*/}
          {/*<div className="radio">*/}
            {/*<label>*/}
              {/*<input type="radio" value="localhost" checked={useLocalImages} onChange={this._changeImageSource}/>*/}
              {/*localhost:5000*/}
            {/*</label>*/}
          {/*</div>*/}
          {/*<div className="radio">*/}
            {/*<label>*/}
              {/*<input type="radio" value="api" checked={!useLocalImages} onChange={this._changeImageSource}/>*/}
              {/*API defined*/}
            {/*</label>*/}
          {/*</div>*/}
        {/*</form>*/}

        {/*<form>*/}
          {/*<div>Highlight</div>*/}
          {/*<div className="radio">*/}
            {/*<label>*/}
              {/*<input type="radio" value="label" checked={showLabel} onChange={this._changeHighlight}/>*/}
              {/*label*/}
            {/*</label>*/}
          {/*</div>*/}
          {/*<div className="radio">*/}
            {/*<label>*/}
              {/*<input type="radio" value="prediction" checked={showPrediction} onChange={this._changeHighlight}/>*/}
              {/*prediction*/}
            {/*</label>*/}
          {/*</div>*/}
        {/*</form>*/}
      {/*</div>*/}

      <div className="overlay info">
        <form onSubmit={this._onInfoSubmit.bind(this)}>
          <ul>
            <li><span className='label'>Current</span>{currentId}</li>
            <li><span className='label'>Index</span> {currentIndex} / {count} jump to: <input type="number" min="0" name="idx"/></li>
            <li><span className='label'>Name</span><span>{reference}</span></li>
            <li><span className='label'>Checked</span><span>{String(get(item, 'meta.checked'))}</span></li>
            <li>
              <span className='label'>Document_type</span><span
                className={classNames('highlight', dashedType, { 'empty': noType })}
                >{type}</span>
            </li>
            {hasPrediction && <li>
              <span className='label'>Prediction</span><span>{prediction} ({Number(confidence).toFixed(2)})</span>
            </li>
            }
            {/*<li>*/}
              {/*<label>*/}
                {/*Document_type:*/}
                {/*<select value={item && item.document_type || ''} onChange={this._onSelectChange.bind(this)}>*/}
                  {/*{ availableTypes.map((type) => <option key={type} value={type}>{type}</option>) }*/}
                {/*</select>*/}
              {/*</label>*/}
            {/*</li>*/}
          </ul>
        </form>
      </div>

      <div className="overlay eye-catcher">
        { showLabel && (type === 'aanvraag' || type === 'unknown' || noType) && <div>
          <div className={classNames('highlight', dashedType, { 'empty': noType })}>{type}</div>
        </div> }
        { showPrediction && prediction && <div>
          <div className={classNames('highlight')}>
            <span>{prediction} ({Number(confidence).toFixed(2)})</span></div>
        </div> }
      </div>

      <div className="bottom-right">
        <FoldPanel>
          <FoldPanel.Header>
            Keyboard shortcuts
          </FoldPanel.Header>
          <FoldPanel.Body>
            <ul>
              <li><span className='label'>Commit</span>space bar</li>
              <li><span className='label'>Prev/next</span>left/right arrow</li>
              <li><span className='label'>Clear type</span>escape</li>
              <li><span className='label'>Aanvraag</span>a</li>
              <li><span className='label'>Besluit</span>b</li>
              <li><span className='label'>Other</span>z / o</li>
            </ul>
          </FoldPanel.Body>
        </FoldPanel>
      </div>

      <div className="bottom-left overlay">
        { item && <AnnotationList annotations={item.annotations} /> }
      </div>

      <div className="top-left">
        <FoldPanel>
          <FoldPanel.Header>
            Filters
          </FoldPanel.Header>
          <FoldPanel.Body>
            <Filters availableFilters={availableFilters}/>
          </FoldPanel.Body>
        </FoldPanel>
      </div>

      <div className="top-center">
        <NotificationArea notifications={notifications} />
      </div>

      { isLoading && <div className="loading-icon"><i className="fa fa-circle-o-notch fa-spin fa-3x"></i></div> }
      <div tabIndex="0" ref={elem => this.annotationContainer = elem}>
        {!isLoading && url && <Annotation url={url}/>}
      </div>
    </div>
  }
}

export default Annotator;
