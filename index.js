const express = require('express')
const bcrypt = require('bcrypt')
const sqlite = require('sqlite3');
const session = require('express-session')
app = express()
app.use(express.urlencoded({extended: true}))
app.set("view engine" , "ejs")
app.set("views" , "views")
app.use(session({ secret: "notgoodsecrete" }))
//create db sqlite3
const db = new sqlite.Database('./users.db');
//create table, it should only once we'll fix it later
//db.run("DROP TABLE users")
//db.run("CREATE TABLE users(ID double auto increment(12354627,30), username char(25), password char(100) )");
//db.run("ALTER TABLE users auto increment 12347852")

const requireLogin = (req, res, next)=>{
    if(!req.session.user_id){return res.redirect('/')}
    next();
}

app.get('/user' ,requireLogin , async (req, res)=>{
    if(!req.session.user_id) {return res.redirect('/');}
    res.render("secret")
})

app.get('/' , (req, res)=>{
 res.render("login")

})
.post('/login' , async (req, res)=>{
    const {username , password} = req.body;
    db.each(`SELECT * FROM users where username= ?`, [username] , async (err, row)=>{
        if (err) { console.log("Error ----------"); console.log(err) }
        else {
        
        const validPassword = await bcrypt.compare(password , row.password);
        if(validPassword){
            //console.log(row.ID)
             req.session.user_id =  "abc45153sdf1sdf2";
            res.redirect('/user');
        }
        else{
            res.redirect('/')
        }
        }
        
    })
    

    

    //res.send("login  " + username)
    
})

app.get('/signup' , (req, res)=>{
    res.render("signup")
})
.post('/signup' , async (req, res)=>{
    const {username, password} = req.body
    const hashPassword = await bcrypt.hash(password , 12)
    res.send("Username " + username + " , Password Hash = " + hashPassword)

    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO users(username, password) VALUES (? , ?)");
        stmt.run(username , hashPassword);
        stmt.finalize();
    });
    //res.send("done " + username)

    //res.redirect('/')
} )

app.get('/logout' , (req, res)=>{
    req.session.destroy();
    res.redirect('/')
})


app.listen(3000 , ()=> console.log("Web App successfully Started"))