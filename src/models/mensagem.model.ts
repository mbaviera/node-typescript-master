import { model, Schema } from "mongoose";

const MensagemSchema = new Schema({
    texto: {
        type: String,
        required: true,        
    },
    createdAt: {
        type: Date,
        default: Date.now,  
    },
    remetente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //como se fosse chave estranheira
        required: true,  
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', //como se fosse chave estranheira
        required: true,  
    }
});

export default model('Mensagem', MensagemSchema);