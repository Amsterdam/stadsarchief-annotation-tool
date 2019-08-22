import React from "react";
import PropTypes from 'prop-types';
import './AnnotationList.css';
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import dayjs from "dayjs";
import get from 'lodash.get';

const AnnotationList = ({annotations}) => {
  return (
    <Table size="small" className='annotation-list'>
      <TableHead>
        <TableRow>
          <TableCell>Key</TableCell>
          <TableCell align="right">Value</TableCell>
          <TableCell align="right">Author</TableCell>
          <TableCell align="right">modified_at</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          annotations.map(({author, tag, created_at, modified_at}) => (
            <TableRow key={tag.key + modified_at}>
              <TableCell component="th" scope="row">{tag.key}</TableCell>
              <TableCell align="right">{tag.value}</TableCell>
              <TableCell align="right">{get(author, 'username')}</TableCell>
              <TableCell align="right">{dayjs(modified_at).toNow(true)} ago</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};

AnnotationList.propTypes = {
  annotations: PropTypes.array.isRequired
};

export default AnnotationList;
