import { Response, Request } from "express";
import mensagemModel from "../models/mensagem.model";

class MensagemController {
    public async enviar(req: Request, res: Response): Promise<Response>{//passa a requisição do tipo request, uma resposta do tipo response, e me retorna uma promise do tipo response
        //create pra criar uma nova mensagem, e passa dentro do create um objeto com os dados, 
        const mensagem = await mensagemModel.create({
            texto: req.body.texto,
            remetente: req.usuario._id, //capturar o remetente com o uso de middlewares, a partir do token de autenticação
            destinatario: req.params.id //entao esse id é exatamento o id passado como paramentro la na rota do mensagem.routes (estou obtendo todos os parametros dessa rota)
        }); 

        return res.json(mensagem); //retorna um res.json com a mensagem
    }

}

export default new MensagemController();