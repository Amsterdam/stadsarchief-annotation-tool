import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import connect from "react-redux/es/connect/connect";
import ClearIcon from '@material-ui/icons/Clear';
import Fab from "@material-ui/core/Fab/Fab";

import {selectors} from "../store";
import {clearAllFilters, clearFilter, setFilter} from "../store/filters";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Filter = ({ classes, handleChange, label, values, activeValue, clearFilter, setFilter }) => {
  const id = `${label}-helper`;

  const onChange = (e) => {
    const itemValue = e.target.value;
    if (itemValue.length > 0) {
      setFilter({label, value: itemValue})
    } else {
      clearFilter({label});
    }
  };

  const selectValue = activeValue || '';

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Select
        value={selectValue}
        onChange={onChange}
        input={<Input name={label} id={id} />}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        <MenuItem value="Null"><em>Null</em></MenuItem>
        { values.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>) }
      </Select>
      <FormHelperText>Some important helper text</FormHelperText>
    </FormControl>
  )
};

const Filters = ({ activeFilters, availableFilters, clearAllFilters, clearFilter, setFilter }) => {
  const classes = useStyles();

  const list = Object.entries(availableFilters);
  return (
    <form className={classes.root} autoComplete="off">
      { list.map(([label, values]) =>
        <Filter
          key={label}
          label={label}
          values={values}
          activeValue={activeFilters[label]}
          clearFilter={clearFilter}
          setFilter={setFilter}
          classes={classes}
        />)
      }
      <Fab size="small" aria-label="clear filters" onClick={e => clearAllFilters()}>
        <ClearIcon />
      </Fab>
    </form>
  );
};

const mapState = (state) => {
  return {
    activeFilters: selectors.filters.getActiveFilters(state),
    availableFilters: selectors.filters.getAvailableFilters(state),
  }
};
const mapDispatch = { clearAllFilters, clearFilter, setFilter };

export default connect(
  mapState,
  mapDispatch
)(Filters);
