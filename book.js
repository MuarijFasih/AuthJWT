const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const users = require('./users');
const books = require('./booklist');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const accessTokenSecret = 'usamabandar';

app.post('/login', (req, res) => {
    //reading the username and password from request body
    const { username, password} = req.body;

    const user = users.find(u => {
        return u.username === username && u.password === password
    });

    if (user){
        //generate acces token
        const accessToken = jwt.sign({username: user.username, role: user.role}, accessTokenSecret);
        res.json({accessToken});
    } else {
        res.send('Username or password incorrect');
    }

});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if(err){
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
