const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const TEST_DIR = path.resolve(PROJECT_DIR, 'test');
const TEST_PATTERN = path.join(TEST_DIR, '*/');

const mergeon = require(PROJECT_DIR);

const directories = glob.sync(TEST_PATTERN);
let i = 0;

const runNext = () => {
  if (i >= directories.length) {
    process.stdout.write(`${chalk.green('All tests passed successfully.')}\n`);
    process.exit(0);
  }

  const dir = directories[i];
  const options = require(path.resolve(dir, 'options.js'));
  const expect = require(path.resolve(dir, 'expect.json'));
  mergeon
    .load(options)
    .then(result => {
      const expectedData = JSON.stringify(expect, null, 2);
      const resultData = JSON.stringify(result.data, null, 2);
      if (expectedData === resultData) {
        i++;
        runNext();
      } else {
        const testName = path.basename(dir);
        return Promise.reject(
          new Error(`Unexpected result for test "${testName}".`)
        );
      }
    })
    .catch(error => {
      const errorString = error.toString();
      process.stdout.write(`${chalk.red(errorString)}\n`);
      process.exit(1);
    });
};
runNext();
