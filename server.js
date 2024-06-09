const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT || 4000;

// Middleware to parse JSON request body
server.use(bodyParser.json());

// Apply middlewares
server.use(middlewares);

// Mount router
server.use(router);

// POST - Create a new item
server.post('/music', (req, res) => {
  const newData = req.body;
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  data.items.push(newData);
  fs.writeFileSync('data.json', JSON.stringify(data));
  res.status(201).send(newData);
});

// GET - Read all items
server.get('/music', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  res.send(data.items);
});

// GET - Read a single item by ID
server.get('/music/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const item = data.items.find(item => item.id === id);
  if (item) {
    res.send(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// PUT - Update an existing item by ID
server.put('/music/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const newData = req.body;
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const index = data.items.findIndex(item => item.id === id);
  if (index !== -1) {
    data.items[index] = newData;
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.send(newData);
  } else {
    res.status(404).send('Item not found');
  }
});

// DELETE - Delete an item by ID
server.delete('/music/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const index = data.items.findIndex(item => item.id === id);
  if (index !== -1) {
    data.items.splice(index, 1);
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.send('Item deleted successfully');
  } else {
    res.status(404).send('Item not found');
  }
});

// Start server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
