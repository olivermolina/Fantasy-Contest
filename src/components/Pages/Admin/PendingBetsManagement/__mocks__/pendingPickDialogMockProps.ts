export const pendingPickDialogProps = {
  handleClose: () => {
    console.log('handleClose');
  },
  open: false,
  settlePick: () => {
    console.log('settlePick');
  },
  row: undefined,
  clearSelectedRow: () => {
    console.log('clearSelectedRow');
  },
  setSelectedBetStatus: () => {
    console.log('setSelectedBetStatus');
  },
  updateBetLeg: () => {
    console.log('updateBetLeg');
  },
  isViewOnly: false,
};
