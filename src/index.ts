import express from 'express';
import mongooseConnection from './connectionDB/mongoseConection';
import Users from './models/UserSchema';

const app = express();
app.use(express.json());

mongooseConnection();

app.get('/', (request, response) => {
    response.status(200).json({ message: 'OK!' });
});

app.get('/users/:username', async (request, response) => {
    const { username } = request.params;

    try {
        const user = await Users.findOne({ username: new RegExp(username, 'i') });

        if (!user) {
            return response.status(404).json({ message: 'Usuário não encontrado.' });
        }

        response.json(user);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Erro ao buscar o usuário.' });
    }
});

app.post('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, avatarUrl, accountCreatedDate, joinedServerDate, infraction, reason, moderator } = req.body;

    try {
        const user = await Users.findOne({ userId });

        const newLog = {
            type: infraction,
            reason,
            date: new Date(),
            moderator
        };

        if (!user) {
            // Criação de novo usuário
            const newUsers = new Users({
                userId,
                username,
                avatarUrl,
                accountCreatedDate: new Date(accountCreatedDate),
                joinedServerDate: new Date(joinedServerDate),
                infractions: { [infraction]: 1 },
                logs: [newLog]
            });

            await newUsers.save();
            return res.status(201).json({ message: 'Usuário criado com sucesso.', user: newUsers });
        }

        // Atualização de um usuário existente
        user.infractions[infraction] = (user.infractions[infraction] || 0) + 1;
        user.logs.push(newLog);

        await user.save();
        res.json({ message: 'Usuário atualizado com sucesso.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar ou criar o usuário.' });
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});