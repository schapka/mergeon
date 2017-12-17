import yargs from 'yargs';
import mergeon from '.';

yargs
  .option('entry', {
    type: 'string',
    alias: ['i', 'e'],
    description: 'Entry file',
    demandOption: true,
  })
  .option('extend-key', {
    type: 'string',
    description: 'Extend key',
  })
  .command(
    ['load [entry]', '$0 [entry]'],
    'Load JSON file',
    () => {},
    argv => run(argv, false)
  )
  .help().argv;

function run(options) {
  mergeon
    .load(options)
    .then(result => {
      const jsonString = JSON.stringify(result, null, 2);
      process.stdout.write(`${jsonString}\n`);
      process.exit(0);
    })
    .catch(error => {
      const errorString = error.toString();
      process.stdout.write(`${errorString}\n`);
      process.exit(1);
    });
}
