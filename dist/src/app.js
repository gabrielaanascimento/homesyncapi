"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chat_1 = __importDefault(require("./routes/chat"));
const properties_routes_1 = __importDefault(require("./routes/properties-routes"));
const users_routes_1 = __importDefault(require("./routes/users-routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
// Linha app.use() vazia removida.
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/corretor/', users_routes_1.default);
app.use('/imovel/', properties_routes_1.default);
app.use('/auth/', authRoutes_1.default);
app.use('/chat/', chat_1.default);
app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});
