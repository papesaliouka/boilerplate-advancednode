const passport = require('passport');
const bcrypt = require('bcrypt');
module.exports = function(app,myDataBase){

    app.use(passport.initialize());

    passport.serializeUser((user,done)=>{
        done(null,null);
    });

    passport.deserializeUser((id,done)=>{
        myDataBase.findOne({_id:new ObjectID(id)},(err,doc)=>{
            done(null,null);
        });
    });


    passport.use(new LocalStrategy(
        (username,password,done)=>{
            myDataBase.findOne({username:username},(err,user)=>{
                console.log(`User ${username} attempted to log in.`)
                if(err) return done(err);
                if(!user) return done(null,false);
                if(!bcrypt.compareSync(password, user.password)) return done(null, false);
                return done(null,user);
            })
        })
    )
}
