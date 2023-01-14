export enum GeolocationPermissionStatus {
  DENIED = 'denied',
  GRANTED = 'granted',
  PROMPT = 'prompt',
}

/**
 * Checks the status of the geolocation permission asynchronously.
 *
 * Returns the permission status: `'denied'`, `'granted'`, or `'prompt'`.
 *
 * Includes a fallback for browsers which do not support the Web Permissions API.
 */
export async function getGeolocationPermissionStatus(): Promise<
  'denied' | 'granted' | 'prompt'
> {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      // successfully got location
      () => resolve(GeolocationPermissionStatus.GRANTED),
      // permission denied
      () => {
        resolve(GeolocationPermissionStatus.DENIED);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  });
}
