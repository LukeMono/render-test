const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

//const http = require('http')

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  },
  {
    id: "4",
    content: "Express is a popular framework for Node.js",
    important: true
  }
]

/*
EXPRESS REPLACES ALL OF THIS:

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})*/

app.get('/', (request, response) => {
  const html = `
  <h1>Basic Note Server</h1>
  <ul>
    <li> <a href="/api/notes">All Notes</a></li>
    <br/>
    ${notes.map(note => `<li><a href="/api/notes/${note.id}">${note.id}: ${note.content}</a></li>`).join('')} 
  </ul>
  ` //Require .join because Node doesn't understand arrays - express as template literal

  response.send(html)
})

app.get('/api/notes', (request, response) => {
  response.json(notes) //NO STRINGIFY, EXPRESS UNDERSTANDS JSON
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.use(express.json()) //Middleware to parse JSON bodies

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id))) 
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)
  response.json(note)
})






