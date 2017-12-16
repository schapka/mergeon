import yargs from 'yargs';
import Mergeon from '.';

yargs
  .option('entry', {
    type: 'string',
    alias: ['i', 'e'],
    description: 'Entry file',
    demandOption: true,
    default: null,
  })
  .option('output', {
    type: 'string',
    alias: ['o'],
    description: 'Output file',
    demandOption: false,
    default: null,
  })
  .command(['$0 [entry]'], 'Load JSON file', () => {}, argv => run(argv, false))
  .help().argv;

function run(options) {
  new Mergeon({ entry: options.entry, output: options.output })
    .load()
    .then(result => {
      if (options.output === null) {
        console.log(JSON.stringify(result.data, null, 2));
      }
      process.exit(0);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
}
