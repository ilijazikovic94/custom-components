
import React from 'react';
import { CreationForm, CreationFormProps } from './CreationForm';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@mui/material/Modal';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    top: '20px',
    bottom: '20px',
    overflow: "scroll",
    left: '25%',
    position: 'absolute',
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

interface CreationModalProps {
  open: boolean,
  onClose: () => void,
}

export const CreationModal: React.FC<CreationModalProps & CreationFormProps> = ({open, onClose, ...props}) => {
  const classes = useStyles();

  return (
      <Modal open={open} onClose={onClose}>
        <div className={classes.paper}>
          <CreationForm {...props} />
        </div>
      </Modal>
  )
}