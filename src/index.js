const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(o => o.username === username);

  if(!user) {
    return response.status(400).json({ error: "User não encontrado!" })
  }

  request.user = user;

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if(userAlreadyExists) return response.status(400).json({error: "User already exists!"})

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todoToUpdate = user.todos.findIndex((o) => o.id === id);

  if(todoToUpdate < 0) {
    return response.status(404).json({ error: "Todo not found" })
  }

  user.todos[todoToUpdate].title = title;
  user.todos[todoToUpdate].deadline = deadline;

  return response.status(201).json(user.todos[todoToUpdate])
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoToUpdate = user.todos.findIndex((o) => o.id === id);

  if(todoToUpdate < 0) {
    return response.status(404).json({ error: "Todo not found" })
  }

  user.todos[todoToUpdate].done = true;

  return response.status(201).json(user.todos[todoToUpdate])
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todoToUpdate = user.todos.findIndex((o) => o.id === id);

  if(todoToUpdate < 0) {
    return response.status(404).json({ error: "Todo not found" })
  }

  user.todos.splice(todoToUpdate, 1)

  return response.status(204).send()
});

module.exports = app;