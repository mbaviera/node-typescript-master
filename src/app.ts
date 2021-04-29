import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { textChangeRangeIsUnchanged } from 'typescript';
import usuarioRoute from './routes/usuario.route';
import mensagemRoute from './routes/mensagem.routes';

//Para tipar os parâmetros de uma função informamos o tipo logo após a declaração do argumento
//para o retorno de função adicionamos a tipagem logo após fechar os parênteses dos parâmetros
export class App {
    private express: express.Application; //tipagem
    private porta = 9000; //porta que vai rodar, nao vai sentido tipar nesse caso

    constructor() { //coisas que API faz por assim dizer, pode deixar o listen por ultimo porque primeiro ela tem que configurar tudo, e depois inicia (no listen)
        this.express = express();        
        this.database();
        this.middlewares();
        this.routes();
        this.listen();
    }

    public getApp(): express.Application {
        return this.express;
    }

    private middlewares(): void {//sem retorno
        this.express.use(express.json());
        this.express.use(cors());
    }

    private listen(): void { //funcao nao retorna nada passa void
        this.express.listen(this.porta, () => { //pra inciar o servidor e passa qual a porta como parametro
            console.log('Servidor iniciado na porta ' + this.porta)
        })
    }

    private database():void {//criado la no site do mongo o banco
        mongoose.connect('mongodb+srv://mateus:baviera@123@cluster0.n4zle.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    }

    private routes(): void{
        this.express.use('/usuarios', usuarioRoute)//primeiro apramatero a rota, que vou chamar de usuarios, segundo o route criado la no usuario.route
        //a rota fica http://localhost/usuarios/cadastro usuario vem daqui e cadastro la no usuario.route.ts
        this.express.use('/mensagens', mensagemRoute)
    }
}