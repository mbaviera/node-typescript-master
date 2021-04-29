import { UsuarioInterface } from "./interfaces/usuario.interfaces";

//o d no nome do arquivo é de declaração, ou seja eu quero declarar um novo tipo ali
declare global{
    namespace Express{
        interface Request{
            usuario?: UsuarioInterface;
        }
    }
}