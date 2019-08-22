import {connect} from "react-redux";
import React from 'react';
import Annotation from './Annotation';
import classNames from 'classnames';
import get from 'lodash.get';
import {getAnnotation, getBakedUrl, getLocalUrl, putAnnotation} from '../api/generic_api';
import NotificationArea from './NotificationArea';
import Filters from "./Filters";
import FoldPanel from "./FoldPanel";
import arrayToObject from "../util/arrayToObject";
import {selectors} from "../store";
import './Annotator.css';
import './panel.css';
import ExampleInfo from "./ExampleInfo";
import ShortcutsList from "./ShortcutsList";
import AnnotationList from "./AnnotationList";


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
    });
  }

  _changeAnnotation(index) {
    const { count, examples } = this.props;

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

  _onInfoSubmit(event) {
    event.preventDefault();
    let inputElement = event.target.querySelector('input[name="idx"]');
    const value = inputElement.value;
    inputElement.value = ""; // clear input field

    const index = parseInt(value, 10);

    if (index >= 0 && index < this.props.count) {
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
    if (this.props.examples) {
      // Examples data already available
      this._changeAnnotation(0);
    }

    const element = this.annotationContainer;
    element.focus();

    this._addListeners(element)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.examples && this.props.examples) { // Waiting for examples data to be available
      this._changeAnnotation(0);
    }
  }

  render() {
    const availableFilters = {
      type: ['aanvraag', 'besluit', undefined],
      stadsdeel: ['SA', 'SU', 'ST', undefined]
    };

    const { count } = this.props;

    const { currentId, currentIndex, isLoading, item, useLocalImages, notifications, showLabel, showPrediction } = this.state;
    let url;
    if (item) {
      if (useLocalImages) {
        const tagsObj = arrayToObject(item.tags);
        url = getLocalUrl(tagsObj.file_name);
      } else {
        url = getBakedUrl(item.tags);
      }
    }

    const reference = get(item, 'meta.reference');
    const type = get(item, 'meta.type');
    const dashedType = type && type.replace(/\s+/g, '-');
    const noType = reference && (type === '' || type === undefined);
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

      <div className="top-right">
        <FoldPanel>
          <FoldPanel.Header>
            Navigation
          </FoldPanel.Header>
          <FoldPanel.Body>
            <form onSubmit={this._onInfoSubmit.bind(this)}>
              <ul>
                <li><span className='label'>Current</span>&nbsp;{currentId}</li>
                <li><span className='label'>Index</span>&nbsp;{currentIndex} / {count} jump to: <input type="number" min="0" name="idx"/></li>
              </ul>
            </form>
          </FoldPanel.Body>
        </FoldPanel>
      </div>

      <div className="top-right">
        <FoldPanel>
          <FoldPanel.Header>
            Info
          </FoldPanel.Header>
          <FoldPanel.Body>
            {item && <ExampleInfo example={item} /> }
          </FoldPanel.Body>
        </FoldPanel>
      </div>

      <div className="eye-catcher panel">
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
            <ShortcutsList/>
          </FoldPanel.Body>
        </FoldPanel>
      </div>

      <div className="bottom-left">
        <FoldPanel direction={'left'}>
          <FoldPanel.Header>
            Annotations
          </FoldPanel.Header>
          <FoldPanel.Body>
            { item && <AnnotationList annotations={item.annotations} /> }
          </FoldPanel.Body>
        </FoldPanel>
      </div>

      <div className="top-left">
        <FoldPanel direction={'left'}>
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


const mapState = (state) => {
  return {
    examples: selectors.examples.getExamples(state),
    count: selectors.examples.getExamplesCount(state),
  }
};
const mapDispatch = {};

export default connect(
  mapState,
  mapDispatch
)(Annotator);
