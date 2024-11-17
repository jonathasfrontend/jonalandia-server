import mongoose from 'mongoose';

function mongooseConnection() {
    const user = "root";
    const pass = "dFrPbwloK4qEAnKy";
    const cluster = "cluster0.xvdlp.mongodb.net";
    const db = "bot";
    
    mongoose.connect(`mongodb+srv://${user}:${pass}@${cluster}/${db}?retryWrites=true&w=majority`)
        .then(() => console.log('Conectado ao MongoDB'))
        .catch(err => console.log('Erro ao conectar ao MongoDB', err));
}

export default mongooseConnection;