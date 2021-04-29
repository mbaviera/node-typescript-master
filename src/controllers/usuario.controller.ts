import { Request, Response } from "express";
import usuarioModel from "../models/usuario.model";

class UsuarioController {
    //async e await pra esperar um resultado, no caso se foi sucesso ou nao, ou seja quando chegar no return é certeza de ter executado o const usuario
    public async cadastrar(req: Request, res: Response): Promise<Response> { //requisição e resposta, req vem do cliente (um nome e senha pra cadastrar), e resposta é o que api manda pro client (sucesso ou nao). Posso tipar o retonro do cadastrar com o promisse, vai retornar um promisse com o tipo response
        const usuario = await usuarioModel.create(req.body); //o req.body que manda os dados pro cadastro, la postman na aba body e manda em formato json geralmente
        const resposta = { //resposta pro usuario
            message: 'Usuario Cadastrado Com Sucesso!',
            _id: usuario._id,
            nome: usuario.nome,
            //todas as propriedades que eu colocar na minha usuario interface eu consigo usar aqui no retorno pro usuario            
        };
        return res.json(resposta); //retorna a resposta 
    }

    public async autenticar(req: Request, res: Response): Promise<Response> { //retorna uma promise do tipo response
        const { nome, senha } = req.body; //pega o nome e senha usando um recurso do ES6, so to extraindo a propriedade nome e senha pra duas variaveis, 
        // const nome = req.body.nome; poderia ter feito assim tambem inves de fazer com o ES6 de cima
        // const senha = req.body.senha;

        //verifica no banco se realmente um usuario com esse nome informado
        const usuario = await usuarioModel.findOne({nome: nome}); //findOne busca apenas um registro no banco, no parametro passa qual atributo e o valor (nao esquece do await pra ter o resultado)        
        if(!usuario){//senao tem o usuaio retorna um status 400 e uma mensagem de erro
            return res.status(400).send({message: 'Usuário não encontrado!'});
        }

        //pra senha é preciso descriptografar a senha pra verificar primeiro, mas vai ser feito na usuario.model
        //depois faz a segunda verificação, cria uma const pra saber se as senhas batem
        const senhaValida = await usuario.compararSenhas(senha);
        if(!senhaValida){//se a senha nao bate retorna um status 400 e uma mensagem de erro
            return res.status(400).send({message: 'Senha incorreta!'});
        }

        //se existir o usuario e senha for valida eu retorno algo pro client
        return res.json({//quando autenticar vai enviar esse json com os dados do usuario e o token
            usuario: usuario,//pode omitir tambem como é o mesmo nome
            token: usuario.gerarToken()
        }); //depois declara a rota la no route (o /login e metodo autenticar)

    }
}

export default new UsuarioController();