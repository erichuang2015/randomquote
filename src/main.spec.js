const fetch = require('isomorphic-fetch');
test('Get random is available', async () => {
  const response = await fetch('https://andruxnet-random-famous-quotes.p.mashape.com/', {
    headers: {
      'X-Mashape-Key': '4sBmTfPz5cmshjhMBw9CubpqE5UMp1xDnzTjsnFYcZ7tGyhUQj',
      'Accept': 'application/json'
    }
  });
  expect(response.status).toBe(200);
});
test('Get random from category is available', async () => {
  const response = await fetch('https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous', {
    headers: {
      'X-Mashape-Key': '4sBmTfPz5cmshjhMBw9CubpqE5UMp1xDnzTjsnFYcZ7tGyhUQj',
      'Accept': 'application/json'
    }
  });
  expect(response.status).toBe(200);
});
test('Get quote of the day is available', async () => {
  const response = await fetch('http://quotes.rest/qod');
  expect([200, 429]).toContain(response.status);
});
