import { createServer } from 'net';
import chalk from 'chalk';

import {
  options,
  random
} from './utils';

const STABLE = 'LG';
const UNSTABLE = 'LGM';

const server = createServer(socket => {
  const host = `${socket.localAddress}:${socket.localPort}`;
  console.log(chalk.greenBright(`Connected: ${host}`));

  const stableAfter = random(options.minStability, options.maxStability);
  const idle = random(0, 100) <= options.idleProbability;
  const idleAfter = idle ? random(options.minIdle, options.maxIdle) : 0;

  let cycles = 0;
  let interval: NodeJS.Timeout | null = null;
  let weight = 0;

  interval = setInterval(() => {
    const isIdle = cycles < idleAfter;
    const isStable = isIdle || cycles >= (stableAfter + idleAfter);

    if (isIdle) {
      weight = 0;
    }

    if (!isStable) {
      weight = +random(options.minWeight, options.maxWeight, false).toFixed(2);
    }

    const value = isStable
    ? `${weight}${STABLE}`
    : `${weight}${UNSTABLE}`;

    console.log(chalk.blueBright(`Sending ${chalk.bold.blueBright(value)} to: ${host}`));

    socket.write(value);
    cycles++;
  }, options.interval);

  socket.on('close', () => {
    if (interval) clearInterval(interval);
    cycles = 0;

    console.log(chalk.yellowBright(`Disconnected: ${host}`));
  })

  socket.on('error', error => {
    console.error(chalk.redBright(error.message));
  })
});

server.listen(options.port, 'localhost', () => {
  console.log(chalk.cyanBright(`Scale is running on port: ${options.port}`));
}).on('error', error => {
  console.error(chalk.redBright(error.message));
});