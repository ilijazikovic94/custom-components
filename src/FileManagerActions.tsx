import { Button, Grid, Tooltip } from '@material-ui/core';
import React from 'react';
import { ImageSearch, Delete } from '@material-ui/icons';
import { GenericObject } from './utils';

interface FileManagerActionsProps {
  data: GenericObject;
  onDelete: (s3Path: string) => void,
  onPreview: (s3Path: string) => void,
}

export const FileManagerActions: React.FC<FileManagerActionsProps> = ({data, onDelete, onPreview}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Button color='primary' size='small' onClick={() => onPreview(data.s3Path)}>
          <Tooltip title='Preview'>
            <ImageSearch />
          </Tooltip>
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button color='secondary' size='small' onClick={() => onDelete(data.s3Path)}>
          <Tooltip title='Delete'>
            <Delete />
          </Tooltip>
        </Button>
      </Grid>
    </Grid>
  );
};
