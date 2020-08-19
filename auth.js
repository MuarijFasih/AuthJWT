const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const users = require('./users');

app.use(bodyParser.json());

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






app.listen(3000, () => {
    console.log(`Authentication service started on port ${3000}`);
});
