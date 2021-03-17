import getopts from 'getopts';

export function parseArgs() {
  return getopts(process.argv.slice(2), {
    alias: {
      server: ['s'],
      host: ['h'],
      port: ['p'],
    },
    boolean: ['s'],
    default: {
      host: 'localhost',
      port: 4250,
    }
  });
}
