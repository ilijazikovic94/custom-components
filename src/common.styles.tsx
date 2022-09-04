import { makeStyles } from '@material-ui/core';

export const useModalStyle = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    top: '20px',
    bottom: '20px',
    left: '10%',
    position: 'absolute',
    overflow: 'auto',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 1, 3),
  },
  textCenter: {
    textAlign: 'center',
  },
}));
