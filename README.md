// ==========================================
// Projeto 1 - To-Do App Full Stack Profissional
//
// ==========================================

// Estrutura de pastas:
/*
todo-app/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ index.ts
│  ├─ tests/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ Dockerfile
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ redux/
│  │  ├─ services/
│  │  └─ App.tsx
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ Dockerfile
├─ docker-compose.yml
└─ README.md
*/

// ==========================================
// backend/src/index.ts
// ==========================================
import express from 'express';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { connectDB } from './utils/db';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ==========================================
// backend/src/models/Task.ts
// ==========================================
import mongoose from 'mongoose';
import { DataTypes, Sequelize } from 'sequelize';

export const TaskSQL = (sequelize: Sequelize) => {
  return sequelize.define('Task', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    title: { type: DataTypes.STRING, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: { type: DataTypes.UUID, allowNull: false },
  });
};

export const TaskNoSQL = mongoose.model('TaskLog', new mongoose.Schema({
  taskId: String,
  action: String,
  timestamp: Date,
}));

// ==========================================
// frontend/src/App.tsx
// ==========================================
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;

// ==========================================
// frontend/src/components/TaskList.tsx
// ==========================================
import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface Props {
  tasks: Task[];
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <div className='space-y-2'>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

// ==========================================
// docker-compose.yml
// ==========================================
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - '5000:5000'
    environment:
      - MONGO_URI=mongodb://mongo:27017/todo
      - POSTGRES_URI=postgres://user:pass@postgres:5432/todo
    depends_on:
      - mongo
      - postgres

  frontend:
    build: ./frontend
    ports:
      - '3000:3000'
    environment:
      - REACT_APP_API_URL=http://localhost:5000/graphql
    depends_on:
      - backend

  mongo:
    image: mongo
    ports:
      - '27017:27017'

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: todo
    ports:
      - '5432:5432'

// ==========================================
// README.md resumido
// ==========================================
/*
# To-Do App Full Stack Profissional

## Tecnologias
- Frontend: React + TypeScript + Redux + TailwindCSS
- Backend: Node.js + Express + GraphQL + MongoDB + PostgreSQL
- Autenticação: JWT + OAuth
- DevOps: Docker + Docker Compose
- Extras: WebSockets, relatórios PDF, multi-tenant

## Setup
1. Clonar repo
2. Rodar `docker-compose up --build`
3. Backend:
4. Frontend: h
## Funcionalidades
- CRUD de tarefas com categorias e prioridade
- Autenticação JWT e OAuth
- Dashboard com gráficos
- Notificações em tempo real
- Rel
