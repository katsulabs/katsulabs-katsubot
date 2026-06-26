import express from 'express'

const app = express()
const port = Number(process.env.PORT ?? 8090)

app.use(express.json())

app.get('/_health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/v1/completions', (req, res) => {
  const { query = '', stream = false } = req.body ?? {}

  if (!stream) {
    res.json({
      answer: `Dummy RAG response for: ${query}`,
    })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const tokens = ['Dummy ', 'RAG ', 'stream ', 'for: ', String(query)]
  let index = 0

  const interval = setInterval(() => {
    if (index >= tokens.length) {
      res.write('data: {"done":true}\n\n')
      clearInterval(interval)
      res.end()
      return
    }
    res.write(`data: ${JSON.stringify({ delta: tokens[index] })}\n\n`)
    index += 1
  }, 120)
})

app.listen(port, () => {
  console.log(`dummy-rag listening on ${port}`)
})
