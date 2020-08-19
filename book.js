const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const books = require('./booklist');
const app = express();

app.use(bodyParser.json());

const accessTokenSecret = 'usamabandar';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if(err){
                console.log('before authenticata1231123123e');
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

app.post('/books', authenticateJWT, (req, res) => {
    const { role } = req.user;

    if(role !== 'admin'){
        return res.sendStatus(403);
    }

    const book = req.body;
    res.send('Book added successfully')
});

app.get('/books', authenticateJWT, (req, res) => {
    res.json(books);
});







app.listen(5000, () => {
    console.log('Books service started on port 5000');
});
