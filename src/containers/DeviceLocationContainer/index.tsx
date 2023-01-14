import React from 'react';
import EnableLocationDialog from '~/components/EnableLocation/EnableLocationDialog';
import { useAppDispatch, useAppSelector } from '~/state/hooks';
import { setOpenLocationDialog } from '~/state/profile';

const DeviceLocationContainer = () => {
  const dispatch = useAppDispatch();
  const { openLocationDialog } = useAppSelector((state) => state.profile);

  const handleOpenLocationDialog = (open: boolean) => {
    dispatch(setOpenLocationDialog(open));
  };

  const onSetDeviceGPS = () => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log('Current location: ' + position);
      },
      function (error) {
        if (error.code == error.PERMISSION_DENIED) {
          setTimeout(() => {
            handleOpenLocationDialog(true);
          }, 1000);
        }
      },
    );
  };

  const handleEnableLocation = () => {
    handleOpenLocationDialog(false);
    onSetDeviceGPS();
  };

  return (
    <EnableLocationDialog
      open={openLocationDialog}
      setOpen={handleOpenLocationDialog}
      handleEnableLocation={handleEnableLocation}
    />
  );
};

export default DeviceLocationContainer;
