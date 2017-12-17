const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const assert = require('assert');

const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const TEST_DIR = path.resolve(PROJECT_DIR, 'test');
const TEST_PATTERN = path.join(TEST_DIR, '*/');

const mergeon = require(PROJECT_DIR);

const directories = glob.sync(TEST_PATTERN);
let i = 0;
let exitCode = 0;

const runNext = () => {
  if (i >= directories.length) {
    if (exitCode === 0) {
      process.stdout.write(
        `${chalk.green('All tests passed successfully.')}\n`
      );
    }
    process.exit(exitCode);
  }

  const dir = directories[i];
  const testName = path.basename(dir);
  const optionsFile = path.resolve(dir, 'options.js');
  const expectedDataFile = path.resolve(dir, 'expect.json');
  const options = require(optionsFile);
  const expectedData = require(expectedDataFile);

  process.stdout.write(`Running test "${testName}"\n`);

  mergeon
    .load(options)
    .then(result => {
      return assert.deepEqual(
        result.data,
        expectedData,
        `Result for test "${testName}" should be equal to "${expectedDataFile}".`
      );
    })
    .catch(error => {
      const errorString = error.toString();
      process.stdout.write(`${chalk.red(errorString)}\n`);
      console.log(error);
      exitCode = 1;
    })
    .then(() => {
      i++;
      runNext();
    });
};
runNext();
