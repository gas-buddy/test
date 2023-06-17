export function get(req, res) {
  res.json({
    pets: [{
      name: 'JoeBob',
    }, {
      name: 'Sunny',
    }],
  });
}

export function post(req, res) {
  res.json({
    message: 'We will take your pet into consideration but good luck competing with Sunny',
  });
}
