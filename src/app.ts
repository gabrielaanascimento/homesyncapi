import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';      
import chatRoutes from './routes/chat.js'; 
import propertiesRoutes from './routes/properties-routes.js';
import usersRoutes from './routes/users-routes.js';
import { Request, Response } from 'express';

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Linha app.use() vazia removida.

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/corretor/', usersRoutes);

app.use('/imovel/', propertiesRoutes);

app.use('/auth/', authRoutes);

app.use('/chat/', chatRoutes);


app.listen(PORT , () => {
    console.log('http://localhost:' + PORT);
});