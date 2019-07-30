import program from 'commander';

function range(value: string) {
  return value.split('..').map(Number);
}

program
  .version('1.0.0')
  .usage('[options]')
  .option('-p --port <n>', 'set the server port', Number.parseInt)
  .option('-i --interval <n>', 'response interval', Number.parseInt)
  .option('-w --weight <a>..<b>', 'weight range returned by the scale', range)
  .option('-m --stability <a>..<b>', 'stabilisation cycles range', range)
  .option('-d --idle <a>..<b>', 'idle cycles range', range)
  .option('-D --idle-probability <n>', 'probability of the scale being idle', Number.parseInt)
  .parse(process.argv);

export const options = {
  port: program.port || 1337,
  interval: program.interval || 1000,
  minWeight: (program.weight || [])[0] || 90,
  maxWeight: (program.weight || [])[1] || 110,
  minStability: (program.stability || [])[0] || 5,
  maxStability: (program.stability || [])[1] || 15,
  minIdle: (program.idle || [])[0] || 3,
  maxIdle: (program.idle || [])[1] || 10,
  idleProbability: program.idleProbability || 50,
};