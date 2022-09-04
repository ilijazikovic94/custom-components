import { Button, Grid, Tooltip } from '@material-ui/core';
import React from 'react';
import { GenericObject } from './utils';
import { FindInPage, Delete } from '@material-ui/icons';

interface ComparablesActionButtonsProps {
  data: GenericObject;
  onDelete: (inscriptionNumber: string) => void;
  onManageFiles: (lotNumbers: number[]) => void;
}

export const ComparablesActionButtons: React.FC<ComparablesActionButtonsProps> = ({ data, onDelete, onManageFiles }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button color='primary' onClick={() => onManageFiles(data.lotNumbers)}>
          <Tooltip title='Manage files'>
            <FindInPage />
          </Tooltip>
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button color='secondary' disabled={data.source !== 'MANUALLY_ADDED'} onClick={() => onDelete(data.inscriptionNumber)}>
          <Tooltip title='Delete'>
            <Delete />
          </Tooltip>
        </Button>
      </Grid>
    </Grid>
  );
};
