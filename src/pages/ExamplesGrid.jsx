import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {connect} from "react-redux";
import {selectors} from "../store";
import {getLocalUrl} from "../api/generic_api";
import Filters from "../components/Filters";
import GridImage from "../components/ImageGrid/GridImage";
import {Link} from "react-router-dom";
import get from 'lodash.get';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const MetaString = ({ tags }) => {
  return <span>
    { tags.map(({key, value}) => <span key={key}>{value}, </span>) }
  </span>
};

const SingleTile = (example, classes) => {
  const url = getLocalUrl(example.reference);

  return (
    <GridListTile key={url}>
      <GridImage url={url} />
      <GridListTileBar
        title={example.reference}
        subtitle={<MetaString tags={example.latest_tags} />}
        actionIcon={
          <Link to={`/annotator`}>
            <IconButton aria-label={`info about ${example.title}`} className={classes.icon}>
              <ArrowForwardIcon />
            </IconButton>
          </Link>
        }
      />
    </GridListTile>
  )
};

const ExamplesGrid = ({ examples, isLoading }) => {
  const classes = useStyles();

  const nCols = 4;

  return (
    <div>
      <div>
        <Filters direction="row"/>
      </div>

      <div className={classes.root}>
        <GridList cellHeight={400} cols={nCols} className={classes.gridList}>
          <GridListTile key="Subheader" cols={nCols} style={{ height: 'auto' }}>
            <ListSubheader component="div">
              {get(examples, 'length', 0)} examples
              { isLoading && <CircularProgress />}
            </ListSubheader>
          </GridListTile>
          {
            examples &&
            examples.length &&
            examples.map(example => SingleTile(example, classes))
          }
        </GridList>
      </div>
    </div>
  );
};

const mapState = (state) => {
  return {
    examples: selectors.examples.getExamples(state),
    isLoading: selectors.examples.isLoadingExamples(state),
  }
};

export default connect(
  mapState
)(ExamplesGrid);
