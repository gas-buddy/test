import GbServiceTester from '@gasbuddy/gb-services-tester';

const tests = new GbServiceTester();

tests.testWithReusableApp('test_startup', (tester) => {
  tester.test('Should be started', (t) => {
    t.ok(tests.service.app, 'App should start');
    t.end();
  });

  tester.test('Should make a request', async (t) => {
    let res = await tests.request('get', '/pets/1');
    t.strictEquals(res.status, 200, 'Should get a 200');
    res = await tests.request('get', '/pets');
    t.strictEquals(res.status, 200, 'Should get a 200');
  });

  tester.end();
});
