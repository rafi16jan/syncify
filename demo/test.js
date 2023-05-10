

const build = require('../index.js');


const runner = build(require.resolve('./test-task.js'));

const result = runner(12345);
console.warn('got result', result);


