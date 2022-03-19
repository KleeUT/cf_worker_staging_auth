import { createHandler } from './handlers';

addEventListener('fetch', (event) => {
  try {
    const e = event as FetchEvent; // Boo it's inferring the wrong event type
    const handler = createHandler();
    return e.respondWith(handler(e.request));
  } catch (e) {
    console.error(e);
    throw e;
  }
});
