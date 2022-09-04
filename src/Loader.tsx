import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: "auto",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 5000,
    width: 40,
    height: 40,
  }
}))

export const Loader: React.FC<{isShown: boolean}> = ({isShown}) => {

  const classes = useStyles()

  return (
      <div className={classes.loader}>
        {isShown &&
          <div>
            <Backdrop open={true} />
            <CircularProgress />
          </div>
        }
      </div>
  );
};