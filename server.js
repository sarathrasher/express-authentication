const express = require('express');

let app = express();

let users = [
    {userId: '1', user: 'sara', email: 'sara@bobeara.com', password: 'pass1'},
    {userId: '2', user: 'hannah', email: 'hannah@banana.com', password: 'pass2'},
    {userId: '3', user: 'billy', email: 'billy@bob.com', password: 'pass3'}
]

let squabs = [
    {squabId: '1', userId: '1', squabs: 'I hate you'},
    {squabId: '3', userId: '2', squabs: 'Blurgh'},
    {squabId: '3', userId: '3', squabs: 'This stinks.'}
];

let generateId = function() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
};	

let readBody = (req, callback) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      callback(body);
    });
};

let authenticate = (req, res, cb) => {
    users.forEach((user) => {
        if (req.query.email === user.email && req.query.password === user.password) {
            cb();
        }
    });
    res.end('Not Allowed.');
};

let listUsers = (req, res) => {
    res.send(users);
};

let listUserSquabs = (req, res) => {
    let userId = req.params.userId;
    console.log(userId);
    let mySquab = squabs.filter(squab =>
        squab.userId === userId
    )
    res.send(mySquab);
}

let listUser = (req, res) => {
    let userId = req.params.userId;
    let user = users.filter(user => 
        user.userId === userId
    );
    res.send(user);
}

let listSquabs = (req, res) => {
    res.send(squabs);
}

let addUser = (req, res) => {
    let newId = generateId();
    readBody(req, (body) => {
        let newUser = JSON.parse(body);
        newUser.userId = newId;
        users.push(newUser);
    })
    res.end('User has been added.');
}

let addSquab = (req, res) => {
    let userId = req.params.userId;
    let newId = generateId();
    readBody(req, (body) => {
        let newSquab = JSON.parse(body);
        newSquab.userId = userId;
        newSquab.squabId = newId;
        squabs.push(newSquab);
    })
    res.end('User has been added.');
}

app.get('/users/:userId/squabs', authenticate, listUserSquabs)
app.get('/users/:userId/', authenticate, listUser)
app.get('/users', authenticate, listUsers);
app.get('/squabs', authenticate, listSquabs)
app.post('/users', addUser);
app.post('/users/:userId/squabs', authenticate, addSquab);

app.listen(3000);