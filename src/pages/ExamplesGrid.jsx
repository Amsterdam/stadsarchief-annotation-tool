import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {connect} from "react-redux";
import {selectors} from "../store";
import {getLocalUrl} from "../api/generic_api";

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

const SingleTile = (example, classes) => {
  const url = getLocalUrl(example.reference);
  return (
    <GridListTile key={url}>
      <img src={url} alt={example.title} />
      <GridListTileBar
        title={example.reference}
        subtitle={<span>My meta data</span>}
        actionIcon={
          <IconButton aria-label={`info about ${example.title}`} className={classes.icon}>
            <ArrowForwardIcon />
          </IconButton>
        }
      />
    </GridListTile>
  )
};

const ExamplesGrid = ({ examples }) => {
  const classes = useStyles();

  const nCols = 3;

  return (
    <div className={classes.root}>
      {
        examples && examples.length &&
        <GridList cellHeight={180} cols={nCols} className={classes.gridList}>
          <GridListTile key="Subheader" cols={nCols} style={{ height: 'auto' }}>
            <ListSubheader component="div">MyHeader</ListSubheader>
          </GridListTile>
          {examples.map(example => SingleTile(example, classes))}
        </GridList>
      }
    </div>
  );
};

const mapState = (state) => {
  return {
    examples: selectors.examples.getExamples(state)
  }
};

export default connect(
  mapState
)(ExamplesGrid);
