//middleware de autenticação, todas as rotas que o usuario precisa estar autenticado vou passar esse middleware pra poder validar, entao se o usuario nao estiver autenticado o
//middleware vai barrar e a rota nem vai ser executada

import { Response, Request, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { UsuarioInterface } from "../interfaces/usuario.interfaces";
import usuarioModel from "../models/usuario.model";

class AuthMiddleware {

    //se o usuario nao passar um token ou o token for invalido vamos barrar a execução
    //coloca a função nas rotas que precisam de autenticacao
    public async autorizarUsuarioByToken(req: Request, res: Response, next: NextFunction): Promise<Response | void>{ //terceiro paramentro é o metodo next com tipagem NextFunction (ver sobre metodo next middleware)
    //capturar o token da requisição
       const token = req.query.token || req.header['x-access-token']; //duas formas possivel, o 'x-access-token' é o padrao

       //se nao tem token retorna um status 401 (sem autorização) e uma mensagem pro usuario
       if(!token){
            return res.status(401).send({message: 'Acesso Restrito!'})
       }

       //try catch pra verificar se o token é invalido
       try {
            //funcação responsavel por decodificar nosso token, ou contrario do jwt.sign la
            //entao o primeiro paramentro passo meu token e no segundo aquela chave publica la , o SECRET
            //entao todos aquels dados do token tao armazenados no objeto dessa variavel (id, nome, avatar etc)
            const usuarioToken = jwt.verify(token, 'SECRET') as UsuarioInterface; //inferindo que o o usuarioToken ta tipada com a minha usuarioInterface, ou seja permite usar as propriedades da interfcaeusuarioi
            //verificar se realmente no id existe no banco
            const usuario = await usuarioModel.findById(usuarioToken._id);

            //verifica se o usuario existe no banco de dados, senao resonrta o status e uma mensagem
            if(!usuario){
                return res.status(400).send({message: 'Usuario não existe no banco de dados!'})
            }     
            
            //injetando o usuario na requisição (praticamente injetando mais uma propriedade no meu request) pra conseguir usa o remetente no mensagem.controller.ts
            //so que esse usuario nao existe la no tipo request la no expressa, entao podemos sobrepor esse tipo request
            //entao declara umna tipagem extra (global) pro meu request la no arquivo src/express.d.ts
            req.usuario = usuario;

            //caso tudo certo (tenha o token) passa pra proxima requisição
            return next();
        } catch (error) {
            return res.status(401).send({message: 'Token Inválido!'})
        }

       
    }
}

export default new AuthMiddleware();