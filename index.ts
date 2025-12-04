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
