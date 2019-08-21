import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


const ShortcutsList = () => {

  return (
    <form>
      <div>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">Commit</TableCell>
              <TableCell align="right">Space bar</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Prev/next</TableCell>
              <TableCell align="right">Left/Right arrows</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Clear</TableCell>
              <TableCell align="right">Escape</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Aanvraag</TableCell>
              <TableCell align="right">a</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Besluit</TableCell>
              <TableCell align="right">b</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Other</TableCell>
              <TableCell align="right">z/o</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </form>
  );
};

export default ShortcutsList;
