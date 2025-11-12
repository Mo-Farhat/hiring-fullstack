import express from 'express';
import cors from 'cors';
import todosRoutes from './routes/todos.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/todos', todosRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});