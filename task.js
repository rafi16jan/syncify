const { workerData, parentPort } = require('worker_threads');

if (!workerData || !parentPort) {
  throw new Error(`expected path/port`);
}

const workerPath = /** @type {string} */ (workerData);

parentPort.on('message', (message) => {
  (async () => {

    /** @type {{port: MessagePort, shared: SharedArrayBuffer, args: any[]}} */
    const typedMessage = message;
    const { port, shared, args } = typedMessage;
    const importPromise = import(require('url').pathToFileURL(workerPath));

    try {
      const { default: method } = await importPromise;
      const result = await Promise.resolve(method(...args));
      port.postMessage({return: result});

    } catch (e) {
      port.postMessage({error: e});

    } finally {
      const int32 = new Int32Array(shared);
      Atomics.notify(int32, 0);
    }

  })();
});
