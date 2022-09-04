import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@mui/material/Modal';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { fileTypeValues } from './utils';
import { Close } from '@material-ui/icons';
import FileUpload from 'react-material-file-upload';
import { useModalStyle } from './common.styles';

const useStyles = makeStyles(() => ({
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export interface FileUploadModalProps {
  open: boolean,
  lotNumber: string,
  onClose: (formData: FormData | null) => void,
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ open, onClose, lotNumber, ...props }) => {
  const classes = useStyles()
  const modalClasses = useModalStyle();

  const [fileType, setFileType] = React.useState('')
  const [file, setFile] = React.useState<File | null>(null)

  const submitForm = () => {
    const formData = new FormData()
    formData.append('lotNumber', lotNumber)
    formData.append('fileType', fileType)
    formData.append('file', file as Blob)
    close(formData)
  }

  const close = (formData: FormData | null) => {
    onClose(formData)
    // reset state on close
    setFileType('');
    setFile(null);
  }

  return (
    <Modal open={open} onClose={() => close(null)}>
      <div className={modalClasses.paper}>
        <div style={{ textAlign: 'right' }}>
          <Button size='small' onClick={() => close(null)}>
            <Close />
          </Button>
        </div>
        <p className={modalClasses.textCenter}>
          <b>File Uploader</b>
        </p>
        <p className={modalClasses.textCenter}>Lot number: {lotNumber}</p>
        <br />
        <div className={classes.fileUploadContainer}>
          <FileUpload value={file ? [file] : []} onChange={(files: File[]) => setFile(files[0])}/>
        </div>
        <br />
        <FormControl fullWidth variant='outlined' size='small'>
          <InputLabel id='file-type-select-label'>File type:</InputLabel>
          <Select
            labelId='file-type-select-label'
            id='file-type-select'
            label='File type'
            value={fileType}
            onChange={(event: any) => setFileType(event.target.value)}
          >
            {fileTypeValues?.map((fileTypeValue: { key: string; value: string }) => (
              <MenuItem value={fileTypeValue.key} key={fileTypeValue.key}>
                {fileTypeValue.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <br />
        <div>
          <Button disabled={!fileType || !file} size='small' onClick={submitForm} color='primary' variant='contained' fullWidth>
            Upload file
          </Button>
        </div>
      </div>
    </Modal>
  );
};
