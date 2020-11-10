const express = require('express')
const fs = require('fs')
const path = require('path')
const routes = require('./routes')
const bodyParser = require('body-parser')
const {ensureExists} = require('./utils')

const PORT = process.env.PORT || 8123
const MAX_ROUTES_RETRIES = process.env.MAX_ROUTES_RETRIES || 10

let app = null
let router = null
let loadedRoutes = true

let rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

module.exports = function package1(opts) {
  logger.info('Starting package1')

  app = express()

  app.use(bodyParser.json({
    verify: rawBodySaver
  }))
  app.use(bodyParser.urlencoded({
    verify: rawBodySaver,
    extended: true
  }))
  app.use(bodyParser.raw({
    verify: rawBodySaver,
    type: function () {
      return true
    }
  }))

  router = express.Router()

  return {
    express: app,
    router: router,

    routesFolder (routesPath) {
      loadedRoutes = false

      logger.debug('Load routes from path:', routesPath)
      fs.readdir(routesPath, (err, items) => {
        loadedRoutes = true

        if (err) {
          return logger.error('Could not read routes path!')
        }

        items.forEach(item => {
          const route = require(path.join(routesPath, item))
          let routeName = path.parse(item).name

          Object.keys(route)
            .forEach(method => {
              let routePattern = routeName
              let routeCb = route[method]

              if ('pattern' in route[method]) {
                routePattern = route[method].pattern
                routeCb = route[method].handler
              }
              router[method]('/' + routePattern, routeCb)
            })

          logger.debug('added route', item)
        })
      })
    },

    static (staticPath) {
      app.use(express.static(staticPath))
    },

    start (customPort, retries = 0) {
      // wait for routes to be loaded
      if (!loadedRoutes) {
        logger.debug('Waiting for routes...')
        if (retries > MAX_ROUTES_RETRIES) {
          logger.error('Could not load routes before starting application')
          return
        }

        retries++
        setTimeout(() => this.start(customPort, retries), 100)

        return
      }

      let listenPort = customPort || PORT

      routes(router)
      app.use(express.static(path.join(__dirname, 'public')))
      app.use('/', router)
      app.listen(listenPort, () => logger.info(`Listening on port http://127.0.0.1:${listenPort}!`))
    }
  }
}
