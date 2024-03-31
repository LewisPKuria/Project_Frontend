import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    width: '200px',
    fontSize: '1.2rem',
  },
}));

const UserRoleSelection = ({ onRoleSelect }) => {
  const classes = useStyles();

  const handleRoleSelect = (role) => {
    onRoleSelect(role);
  };

  return (
    <div className={classes.root}>
      <h2>Welcome to the Potato Plant Leaf Image Processing App</h2>
      <h3>Please select your role:</h3>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => handleRoleSelect('farmer')}
      >
        Farmer
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => handleRoleSelect('agricultural_officer')}
      >
        Agricultural Officer
      </Button>
    </div>
  );
};

export default UserRoleSelection;
