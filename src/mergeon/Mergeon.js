const DEFAULT_OPTIONS = {
  entry: null,
  extendKey: '_extends',
};

export default class Mergeon {
  constructor(options) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ data: { dummy: 'result' } }), 1000);
    });
  }
}
