export function get(req, res) {
  const { petId } = req.params;

  // our spec should do numeric validations on petId
  if (petId === '1') {
    res.json({
      name: 'Sonny',
    });
  } else {
    res.status(404).json({
      message: 'petId not found',
    });
  }
}
