import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { Button, Divider, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Table } from './Table';
import { AgGridColumn } from 'ag-grid-react';
import { FileManagerActions } from './FileManagerActions';
import { CloudDownload, CloudUpload, Close, Fullscreen } from '@material-ui/icons';
import FilePreview from 'react-file-preview-latest';
import { FileUploadModal } from './FileUploadModal';
import { LotFile } from './utils';
import { FullScreenFileViewModal } from './FullScreenFileViewModal';
import { useModalStyle } from './common.styles';

const useStyles = makeStyles(() => ({
  filePreview: {
    '& div': {
      backgroundColor: 'none !important',
      padding: 0,
      width: '100% !important',
      '& object': {
        height: '65vh !important',
      },
    },
  },
  fileManagerTable: {
    '& > div:first-child': {
      height: '77.5vh !important',
    },
  },
}));

export interface FileManagerModalProps {
  open: boolean;
  lotNumbers: string[] | null;
  uploadLotFile: (formData: FormData) => Promise<LotFile>;
  getFile: (s3Path: string) => Promise<any>;
  getLotFiles: (lotNumber: string) => Promise<LotFile[]>;
  deleteLotFile: (s3Path: string) => Promise<string>;
  onClose: () => void;
}

interface FileManagerModelState {
  files: LotFile[],
  objectUrl: string,
  previewFile: File | undefined,
  isShowingFileUpload: boolean,
  isShowFullScreen: boolean,
  selectedLotNumber: string,
}

const initStateValues = {
  files: [],
  objectUrl: '',
  previewFile: undefined,
  isShowingFileUpload: false,
  isShowFullScreen: false,
  selectedLotNumber: '',
}

export const FileManagerModal: React.FC<FileManagerModalProps> = ({ open, onClose, lotNumbers, ...props }) => {
  const { uploadLotFile, getLotFiles, getFile, deleteLotFile } = props;
  const classes = useStyles();
  const modalClasses = useModalStyle();

  const [state, setState] = React.useState<FileManagerModelState>(initStateValues);

  React.useEffect(() => {
    if (lotNumbers !== null && lotNumbers?.length > 0) {
      setState({ ...state, selectedLotNumber: lotNumbers[0] });
    }
  }, [lotNumbers]);

  React.useEffect(() => {
    if (state.selectedLotNumber) {
      getFiles(state.selectedLotNumber);
    }
  }, [state.selectedLotNumber]);

  const getFiles = async (selectedLotNumber: string) => {
    const response: any = await getLotFiles(selectedLotNumber);
    setState({
      ...state,
      files: response,
    });
  }

  const onError = () => {
    alert('Preview unavailable.');
  };

  const onLotChange = (event: any) => {
    setState({ ...state, selectedLotNumber: event.target.value });
  };

  const getPreviewFile = async (s3Path: string) => {
    const response = await getFile(s3Path);
    const blob = new Blob([response]);
    const file = new File([response], s3Path, {type: 'application/pdf'});
    setState({
      ...state,
      previewFile: file,
      objectUrl: window.URL.createObjectURL(blob)
    });
  };

  const onDelete = async (s3Path: string) => {
    await deleteLotFile(s3Path);
    await getFiles(state.selectedLotNumber);
  }

  const onFileUploadClose = async (formData: FormData | null) => {
    setState({
      ...state,
      isShowingFileUpload: false,
    });
    if (formData) {
      await uploadLotFile(formData)
      await getFiles(state.selectedLotNumber);
    }
  }

  const toggleFullScreen = () => {
    setState({
      ...state,
      isShowFullScreen: !state.isShowFullScreen,
    });
  }

  const handleCloseModal = () => {
    setState(initStateValues);
    onClose();
  }
  
  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <div className={modalClasses.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent='flex-start' alignItems='center'>
                <Grid item xs={6}>
                  <Grid container spacing={2} justifyContent='flex-start' alignItems='center'>
                    <Grid item xs={4}>
                      File manager
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth variant='outlined' size='small'>
                        <InputLabel id='file-manager-lot-select-label'>For Lot Number:</InputLabel>
                        <Select
                          labelId='file-manager-lot-select-label'
                          id='file-manager-lot-select'
                          label='Lot number'
                          value={state.selectedLotNumber}
                          onChange={onLotChange}
                        >
                          {lotNumbers?.map((lotNumber: string) => (
                            <MenuItem value={lotNumber} key={lotNumber}>
                              {lotNumber}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        disabled={!state.selectedLotNumber}
                        variant='contained'
                        size='small'
                        color='primary'
                        onClick={() => setState({ ...state, isShowingFileUpload: true })}
                      >
                        <CloudUpload />
                        &nbsp;Upload file
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Button size='small' onClick={handleCloseModal}>
                    <Close />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6} className={classes.fileManagerTable}>
              <Table
                rowData={state.files}
                frameworkComponents={{
                  actions: FileManagerActions,
                }}
              >
                <AgGridColumn field='actions' cellRenderer='actions' cellRendererParams={{ onPreview: getPreviewFile, onDelete: onDelete }} />
                <AgGridColumn field='type' />
                <AgGridColumn field='timestamp' />
              </Table>
            </Grid>
            <Grid item xs={6} className={classes.filePreview}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={6}>
                  File preview
                </Grid>
                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
                  <Button variant='contained' size='small' color='primary' disabled={!state.objectUrl} style={{ marginRight: 10, }} onClick={toggleFullScreen}>
                    <Fullscreen />
                    &nbsp;Full Screen
                  </Button>
                  <a href={state.objectUrl} download style={state.objectUrl ? {} : {cursor: 'not-allowed', pointerEvents: 'none'}}>
                    <Button variant='contained' size='small' color='primary' disabled={!state.objectUrl}>
                      <CloudDownload />
                      &nbsp;Download file
                    </Button>
                  </a>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <FilePreview type='file' file={state.previewFile} onError={onError} height={"auto"} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Modal>
      <FileUploadModal open={state.isShowingFileUpload} lotNumber={state.selectedLotNumber} onClose={onFileUploadClose} />
      {state.previewFile &&
        <FullScreenFileViewModal open={state.isShowFullScreen} file={state.previewFile} onClose={toggleFullScreen} />
      }
    </>
  );
};
