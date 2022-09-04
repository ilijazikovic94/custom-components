import React from 'react';
import Modal from '@mui/material/Modal';
import { Button, makeStyles } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import FilePreview from 'react-file-preview-latest';

import { useModalStyle } from './common.styles';

const useStyles = makeStyles(() => ({
  filePreview: {
    height: '100%',
    '& div': {
      height: '100%',
    }
  },
}))

export interface FullScreenFileViewModalProps {
  open: boolean;
  file: File;
  onClose: () => void;
}

export const FullScreenFileViewModal: React.FC<FullScreenFileViewModalProps> =
  ({ open, onClose, file }) => {
    const classes = useStyles();
    const modalClasses = useModalStyle();

    const onError = (e: string | undefined) => {
      console.error('File Error');
      console.error(e);
    };

    return (
      <Modal open={open} onClose={onClose}>
        <div className={modalClasses.paper}>
          <div style={{ textAlign: 'right' }}>
            <Button size="small" onClick={onClose}>
              <Close />
            </Button>
          </div>
          <div className={classes.filePreview}>
            <FilePreview
              type="file"
              file={file}
              onError={onError}
              width={'calc(100% - 25px)'}
            />
          </div>
        </div>
      </Modal>
    );
  };
