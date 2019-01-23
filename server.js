const express = require('express')
const next = require('next')
const compression = require('compression')
const dev = process.env.NODE_ENV !== 'prod'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.get('/about/:id', (req, res) => {
    const actualPage = '/about'
    const queryParams = {
      id: req.params.id
    }
    app.render(req, res, actualPage, queryParams)
  })

  server.get('/news/:created', (req, res) => {
    const actualPage = '/app'
    const query = {
      created: req.params.created
    }
    app.render(req, res, actualPage, query)
  })

  server.get('/', (req, res) => {
    const actualPage = '/app'
    const query = {}
    app.render(req, res, actualPage, query)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
}).catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})