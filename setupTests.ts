import '@testing-library/jest-dom';
jest
  .useFakeTimers('modern')
  .setSystemTime(new Date('2021-01-01T00:00:00.000Z'));
