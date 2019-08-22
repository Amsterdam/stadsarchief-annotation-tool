import get from "lodash.get";
import classNames from "classnames";
import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import arrayToObject from "../util/arrayToObject";

const ExampleInfo = ({ example }) => {
  const tags = arrayToObject(example.latest_tags);

  const reference = get(example, 'meta.reference');
  const type = get(tags, 'type');
  const dashedType = type && type.replace(/\s+/g, '-');
  const noType = reference && (type === '' || type === undefined);
  const hasPrediction = example && example.meta && typeof example.meta.prediction !== 'undefined';
  const prediction = get(example, 'meta.prediction');
  const confidence = get(example, 'meta.confidence');

  return (
    <form>
      <div>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">Name</TableCell>
              <TableCell align="right">{tags.file_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Dossier</TableCell>
              <TableCell align="right">{tags.dossier_nummer}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Sub dossier</TableCell>
              <TableCell align="right">{tags.subdossier}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Checked</TableCell>
              <TableCell align="right">{String(get(example, 'meta.checked'))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Document_type</TableCell>
              <TableCell align="right"><span
                className={classNames('highlight', dashedType, { 'empty': noType })}
              >{type}</span></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <ul>
        {hasPrediction && <li>
          <span className='label'>Prediction</span><span>{prediction} ({Number(confidence).toFixed(2)})</span>
        </li>
        }
      </ul>
    </form>
  );
};

export default ExampleInfo;
