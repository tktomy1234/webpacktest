const path = require('path')

module.exports.get = {
  pattern: 'myactivity/:activityId',
  handler (req, res) {
    res.download(path.resolve(`./myactivity/${req.params.activityId}.csv`))
  }
}
