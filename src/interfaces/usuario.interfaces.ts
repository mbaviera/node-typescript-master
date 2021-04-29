export interface UsuarioInterface {
    _id: any | string; //id do tipo any ou string
    nome?: string; //interrogação significa que é uma propriedade opcional, senao quiser usa o nome por exmpleo nao tem problema, o typescript nao vai gerar erro
    senha?: string;
    avatar?: string;

    //ai la no usuario.model informa o modelo de usuario que essa interface existe
}