import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';      
import chatRoutes from './routes/chat'; 
import propertiesRoutes from './routes/properties-routes';
import usersRoutes from './routes/users-routes';
import { Request, Response } from 'express';

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Linha app.use() vazia removida.

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/corretor', usersRoutes);

app.use('/imovel', propertiesRoutes);

app.use('/auth/', authRoutes);

app.use('/chat/', chatRoutes);


app.listen(3000, () => {
    console.log('http://localhost:3000');
});