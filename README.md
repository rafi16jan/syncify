Converts async methods to sync using `worker_threads`.
Library related to [this blog post](https://whistlr.info/2021/block-nodejs-main-thread/).
Does not require compilation steps to work, can run anywhere in Node.js, has zero dependencies.

This'll allow you to call async methods _as if_ they were sync, but you have to move the async methods into their own file (and they'll run inside a `Worker`).

# Usage

~~Currently ESM for now, but could be made CJS.~~ This fork fixes some issue and convert it to CJS module.

Here's a demo which artificially loads a file using the async API of the built-in FS library, but makes those calls sync to the main thread.

In your main file:

```js
// main.js
const build = require('node-syncify');
const method = build(require.resolve('./method.js'));
const result = method('foo.json');

console.info('did something sync!', result);
```

In your helper file (called "method.js" here), do this:

```js
// method.js
const fs = require('fs').promises;

export default async function(filename) {
  // do something async just for fun
  await new Promise((r) => setTimeout(r, 1000));
  const data = await fs.readFile(filename);
  return data;
};
```

Great! 🥳
