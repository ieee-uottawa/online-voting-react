import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function VoteConfirmationDialog({ show, positions, handleConfirmation, handleCancel }) {
  return (
    <Dialog open={show}>
      <DialogTitle>Confirm who you voted for</DialogTitle>
      <DialogContent>
        {
          Object.values(positions)
            .map(({ position, name }) => (
              <Typography key={position} variant="body1" gutterBottom>
                {position}
                :
                {' '}
                <strong>{name}</strong>
              </Typography>
            ))
        }
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleConfirmation}>Confirm</Button>
        <Button color="secondary" onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

VoteConfirmationDialog.propTypes = {
  handleConfirmation: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  positions: PropTypes.object.isRequired,
};
