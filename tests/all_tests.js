import fs from 'fs';
import os from 'os';
import path from 'path';
import GbServicesTester from '@gasbuddy/gb-services-tester';

const tests = fs.readdirSync(__dirname)
  .filter(f => f.startsWith('test_') && f.endsWith('.js'));
tests.sort();

new GbServicesTester().test('pet-serv', { jobs: os.cpus().length }, (t) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  tests.forEach(f => require(path.join(__dirname, f)));
  t.end();
});
