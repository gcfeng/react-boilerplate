const path = require('path');
const webpack = require('webpack');
const logUpdate = require('log-update');
const chalk = require('chalk');
const address = require('address');
const env = require('../env');

class ProgressBar extends webpack.ProgressPlugin {
  constructor(options) {
    super();

    this.options = Object.assign({
      name: 'progressBar',
      devServer: false,
    }, options);

    // Assign another handler
    this.handler = (percent, message, ...details) => {
      this.progress(percent, message, details);
    };
    this.state = {
      progress: -1,
      message: '',
      details: [],
      request: null,
    };
  }

  apply(compiler) {
    // Prevent adding multi instances to the same compiler
    if (compiler.progressBar) return;
    compiler.progressBar = this;

    super.apply(compiler);

    compiler.hooks.compile.tap('ProgressBar:start', () => {
      logUpdate([
        chalk.gray(this.currentTime()),
        chalk.bgBlue.black(' WAIT '),
        chalk.blue(`[${this.options.name}]`),
        chalk.blue('Compiling...')
      ].join(' '));
      logUpdate.done();
    });

    compiler.hooks.done.tap('ProgressBar:done', stats => {
      let msg = [
        `\n${chalk.gray(this.currentTime())}`,
        chalk.bgGreen.black(' DONE '),
        chalk.blue(`[${this.options.name}]`),
        chalk.green(`Compiled successfully in ${this.prettyTime(stats.startTime, stats.endTime)}`),
      ];
      if (this.options.devServer) {
        msg = msg.concat([
          '\n\n',
          '  App running at: \n',
          `  - Local:   ${chalk.cyan(`http://localhost:${env.port}/`)}\n`,
          `  - Network: ${chalk.cyan(`http://${address.ip()}:${env.port}/`)}`,
          '\n\n'
        ]);
      }
      logUpdate(msg.join(' '));
      logUpdate.done();

      Object.assign(this.state, {
        progress: 100,
      });
    });
  }

  progress(percent = 0, message = '', details = []) {
    const progress = Math.floor(percent * 100);
    Object.assign(this.state, {
      progress,
      message: message || '',
      details,
      request: this.parseRequest(details[2])
    });

    logUpdate(this.progressMsg());
  }

  progressMsg() {
    return [
      `${this.state.progress || 0}%`,
      this.state.message,
      chalk.gray(this.state.details[0] || ''),
      chalk.gray(this.state.details[1] || ''),
      chalk.gray(this.formatRequest()),
    ].join(' ');
  }

  parseRequest(requestStr) {
    const nodeModules = `${path.delimiter}node_modules${path.delimiter}`;
    const parts = (requestStr || '').split('!');

    let file = parts.pop().split(nodeModules).pop() || '';
    file = path.relative(
      process.cwd(),
      file.split('?')[0] || '',
    );

    const loaders = parts
      .map(part => {
        const m = /[a-z0-9-@]+-loader/.exec(part);
        return m ? m[0] : null;
      })
      .filter(s => s && s.length);

    return {
      file: file || null,
      loaders,
    }
  }

  formatRequest() {
    const loaders = this.state.request.loaders.join(' › ');
    if (!loaders.length) {
      return this.state.request.file || '';
    }
    return `${loaders} › ${this.state.request.file || ''}`;
  }

  prettyTime(startTime, endTime) {
    let diff = endTime - startTime;
    const units = [
      { unit: 'h', convert: 3600000, val: 0 },
      { unit: 'm', convert: 60000, val: 0 },
      { unit: 's', convert: 1000, val: 0 },
      { unit: 'ms', convert: 0, val: 0 }
    ];
    const last = units.length - 1;
    const msg = [];
    units.forEach((u, index) => {
      if (diff > u.convert && index < last) {
        u.val = Math.floor(diff / u.convert);
        diff = diff - u.convert * u.val;
        if (u.val > 0 && index < last) {
          msg.push(`${u.val}${u.unit}`);
        }
      } else if (index === last) {
        msg.push(`${diff}${u.unit}`);
      }
    });
    return msg.join('');
  }

  currentTime() {
    const now = new Date();
    return [
      now.getHours() > 9 ? now.getHours() : `0${now.getHours()}`,
      now.getMinutes() > 9 ? now.getMinutes() : `0${now.getMinutes()}`,
      now.getSeconds() > 9 ? now.getSeconds() : `0${now.getSeconds()}`
    ].join(':');
  }
}

module.exports = ProgressBar;
