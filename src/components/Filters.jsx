import PropTypes from 'prop-types';
import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import connect from "react-redux/es/connect/connect";
import ClearIcon from '@material-ui/icons/Clear';

import {selectors} from "../store";
import {clearAllFilters, clearFilter, setFilter} from "../store/filters";
import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";

const useStyles = makeStyles(theme => ({
  root: props => ({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: props.direction,
  }),
  formControl: {
    margin: theme.spacing(1),
    minWidth: 140,
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
        <MenuItem value=""><em>All</em></MenuItem>
        { values.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>) }
        <MenuItem value="Null"><em>Null</em></MenuItem>
      </Select>
      {/*<FormHelperText>Some important helper text</FormHelperText>*/}
    </FormControl>
  )
};

const Filters = ({ activeFilters, availableFilters, clearAllFilters, clearFilter, setFilter, direction }) => {
  const classes = useStyles({direction});

  const [filterConflict, setFilterConflict] = useState(false);

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

      <FormControlLabel
        disabled
        control={
          <Checkbox
            checked={filterConflict}
            onChange={() => setFilterConflict(!filterConflict)}
            value={filterConflict}
            color="primary"
          />
        }
        label="Conflicting"
      />

      <Button variant="outlined" className={classes.button} onClick={e => clearAllFilters()}>
        Clear <ClearIcon />
      </Button>
    </form>
  );
};

Filters.defaultProps = {
  direction: 'column'
};
Filters.propTypes = {
  direction: PropTypes.string
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
