// src/app.ts

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';      
import chatRoutes from './routes/chat.js'; 
import propertiesRoutes from './routes/properties-routes.js';
import usersRoutes from './routes/users-routes.js';
import { Request, Response } from 'express';
import { testConnection } from './data/database.js'; // 1. IMPORTE A FUNÇÃO

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/corretor/', usersRoutes);
app.use('/imovel/', propertiesRoutes);
app.use('/auth/', authRoutes);
app.use('/chat/', chatRoutes);

// 2. CRIE UMA FUNÇÃO `startServer` E CHAME O TESTE DE CONEXÃO
const startServer = async () => {
    await testConnection(); // Testa a conexão com o DB antes de iniciar o servidor
    
    app.listen(PORT , () => {
        console.log('Servidor rodando em http://localhost:' + PORT);
    });
}

// 3. INICIE O SERVIDOR
startServer();