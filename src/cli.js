import yargs from 'yargs';
import Mergeon from '.';

yargs
  .option('entry', {
    type: 'string',
    alias: ['i', 'e'],
    description: 'Entry file',
    demandOption: true,
  })
  .command(
    ['load [entry]', '$0 [entry]'],
    'Load JSON file',
    () => {},
    argv => run(argv, false)
  )
  .help().argv;

function run(options) {
  new Mergeon({ entry: options.entry })
    .load()
    .then(result => {
      const jsonString = JSON.stringify(result.data, null, 2);
      process.stdout.write(`${jsonString}\n`);
      process.exit(0);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
}
