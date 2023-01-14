import { useEffect, useState } from 'react';
import { setOpenLocationDialog } from '~/state/profile';
import { useAppDispatch } from '~/state/hooks';
import { IDeviceGPS } from '~/lib/tsevo-gidx/GIDX';

export const useDeviceGPS = () => {
  const dispatch = useAppDispatch();
  const [deviceGPS, setDeviceGPS] = useState<IDeviceGPS | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setDeviceGPS({
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
        });
      },
      function (error) {
        if (error.code == error.PERMISSION_DENIED) {
          setTimeout(() => {
            dispatch(setOpenLocationDialog(true));
          }, 1000);
        }
      },
    );
  }, []);

  return deviceGPS;
};
