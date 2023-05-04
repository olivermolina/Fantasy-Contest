export const pendingPickDialogProps = {
  handleClose: () => {
    console.log('handleClose');
  },
  open: false,
  onClickDeleteRow: () => {
    console.log('onClickDeleteRow');
  },
  row: undefined,
  clearSelectedRow: () => {
    console.log('clearSelectedRow');
  },
  isViewOnly: false,
};
