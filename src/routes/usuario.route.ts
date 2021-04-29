import { Router } from "express";
import usuarioController from "../controllers/usuario.controller";

//criar rota de cadastro
const usuarioRoute = Router();

//post é o metodo usado pra casdatrado
usuarioRoute.post('/cadastro', usuarioController.cadastrar); //segundo parametro passo a controller. Tem que chamar a rota la no app.ts
usuarioRoute.post('/login', usuarioController.autenticar);

export default usuarioRoute;