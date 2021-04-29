import { model, Schema, Document } from "mongoose";
import { UsuarioInterface } from "../interfaces/usuario.interfaces";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//usuario model herda do usuario interface la, vai ter os mesmo atributos, pra isso usa o extends (o document é do mongoose)
interface UsuarioModel extends UsuarioInterface, Document {
    compararSenhas(senha: string): Promise<boolean>;//tipa o metodo, recebe uma senha do tipo string e retorna uma promise do tipo boolean
    gerarToken(): string; //gerarToken retorna uma string
}

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true,        
    },
    senha: {
        type: String,
        required: true,  
    },
    avatar :{
        type: String,
        required: false,  
    }
});

//criptografia
//hooks = alguma coisa que faça quando uma ação for realizada
//quando o modelo de usuario perceber que foi salvo um cadastro eu quero executar uma ação, ação de criptografar a senha
UsuarioSchema.pre<UsuarioModel>('save', async function criptografarSenha(){//pre = antes de acontecer algo executa uma ação. Quando? no 'save', ou seja quando salvar o usuario.  
    //pra capturar a senha eu vou tipar o pre com o tipo <UsuarioModel>
    this.senha = await bcrypt.hash(this.senha, 8)// parametro que vai ser criptografado e o tamanho da criptografia, quando maior mais segura por ex
});

//outra Hook, pra quando cadastrar um usuario gerar um avatar aleatorio, usando uma API que gera avatares randomicos
UsuarioSchema.pre<UsuarioModel>('save', function gerarAvatar(){
    const randomId = Math.floor(Math.random() * (1000000)) + 1; //declarando uma randomId e gerando um num aleatorio

    this.avatar = `https://api.adorable.io/avatars/285/${randomId}.png`;// passo pro avatar a url da api, o tamanho (285), concatenado com meu randomId (template string que chama essa concatenacao)
});

UsuarioSchema.methods.compararSenhas = function(senha: string): Promise<Boolean> {//methods = inclui mais um matodo no modelo, ele recebe uma function com senha tipada em string
    return bcrypt.compare(senha, this.senha);//usa a lib bcrypt pra comparar o hash da senha criptgrafada se bata com a senha do banco
}

UsuarioSchema.methods.gerarToken = function(): string {
    //criar um objeto decodertoke, nosso coder decodificado
    const decodedToken = { //ou seja o token decodificado tras essas informacaoes aqui em baixo
        _id: String(this._id),
        nome: this.nome,
        avatar: this.avatar
    };

    //funcao responsavel pela criptografia, por gerar um base64, chama ela depois la no usuario.controller
    //parametros o decoded token, o segundo uma chave secreta, uma string (nome qualquer por enquanto), e o terceiro um obj com opções
    return jwt.sign(decodedToken, 'SECRET', {
        expiresIn: '1d' //quando expira, por exemplo, se ficar mais de 1 dia sem usar a app vai precisar gerar outro token
    }) 

}

export default model<UsuarioModel>('Usuario', UsuarioSchema);//pra informar que o meu modelo de usuario tem esses tipos, coloca o tipo ali <>