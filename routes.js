const passport = require('passport');

module.exports = function(app,myDataBase){

    app.route('/').get((req, res) => {
        res.render(process.cwd() + '/views/pug', {title: 'Connected to Dataabase', message: 'Please login',showLogin:true});
    });
    app.route('/login').post(passport.authenticate('local',{failureRedirect:'/'}),(req,res)=>{
        res.redirect('/profile')
    });

    app.route('/profile').get(ensureAuthenticated,(req,res)=>{
        res.render(process.cwd()+'/views/pug/profile',{username: req.user.username})
    })
    app.route('/logout').get((req,res)=>{
        req.logout()
        res.redirct('/')
    });
    
    app.route('/register')
        .post((req,res,next)=>{
            const hash = bcrypt.hashSync(req.body.password,12);

            myDataBase.findOne({username: req.body.username}, (err,user)=>{
                if(err){
                    next(err);
                }else if(user){
                    res.redirect('/')
                }else{
                    myDataBase.insertOne({
                        username: req.body.username,
                        password: hash
                    },
                        (err,doc)=>{
                            if(err){
                                res.redirect('/')
                            }else{
                                next(null, doc.ops[0])
                            }
                        }
                    )
                }
            })
        },
            passport.authenticate('local',{failureRedirect:'/'}),
            (req,res,next)=>{
                res.redirect('/profile')
            }
        );
}


function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
