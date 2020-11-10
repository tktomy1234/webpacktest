const defaultResponse = {
  message: 'no controller configured'
}

module.exports = function routes (router) {
  router.get('/', (req, res) => res.json(defaultResponse))
  router.post('/sports', (req, res) => res.json(defaultResponse))
  router.get('/home', (req, res) => res.json(defaultResponse))
}
