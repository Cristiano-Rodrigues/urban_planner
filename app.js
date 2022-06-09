import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)
const port = 3000

app.use(express.static('public'))

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})