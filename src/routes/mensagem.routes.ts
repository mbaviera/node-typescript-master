import { Router } from "express";
import mensagemController from "../controllers/mensagem.controller";
import authMiddleware from "../middlewares/auth.middleware";

const mensagemRoute = Router();
//metodo post aqui

//primeiro parametro sempre a rota, os outros as funcoes executadas
//passa o middleware (feito la nos middlewares) depois da rota pra validar, posso colocar quantos eu quiser
mensagemRoute.post('/:id', authMiddleware.autorizarUsuarioByToken, mensagemController.enviar); 
//rota fica localhost:9000/mensagens/id do usuario que a gente quer, pra conseguir o id usa daquela forma ali
//dessa forma com '/:id' eu consigo capturar la na controller esse valor (que pode ser dinamico) (poderia fazer com nome, senha etc)
//OU SEJA ELE TENTA ACESSA A ROTA E A PRIMEIRA COISA É O MIDDEWARE, QUE VAI VALIDAR, SE ESTIVER INVALIDO ELE NEM CHEGA NO mensagemController.enviar

export default mensagemRoute;