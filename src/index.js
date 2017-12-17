import Loader from './Loader';

function mergeon(options) {
  return new Loader(options);
}

mergeon.load = options => new Loader(options).load();

export default mergeon;
