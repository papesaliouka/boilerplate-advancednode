'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const pug = require('pug');
const session = require('express-session');
const passport = require('passport');
const app = express();
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const routes = require('./routes');
const auth = require('./auth');

app.set('view engine', 'pug');

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie:{secure:false}
}));


myDB(async client =>{
    const myDataBase = await client.db('database').collection('users');
    
    routes(app,myDataBase);
    auth(app, myDataBase);

    app.use((req, res, next) => {
        res.status(404)
        .type('text')
        .send('Not Found');
    });


}).catch(e=>{
    app.route('/').get((req,res)=>{
        res.render('pug', {title:e,message:'Uable to login'})
    })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});
