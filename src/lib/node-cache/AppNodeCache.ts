import NodeCache from 'node-cache';

const appNodeCache = new NodeCache({
  stdTTL: 10, // Default cache time to live in seconds
});

export { appNodeCache };
