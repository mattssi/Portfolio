/* 1 - Invocamos express*/
const express = require('express');
const app =express();

/* 2 - Setear urlencoded para capturar los datos del form*/
app.use(express.urlencoded({extended:false}));
app.use(express.json());

/* 3 - Invocar dotenv */
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

/* 4 - Directorio public*/
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

/* 5 - Motor de plantillas*/
app.set('view engine', 'ejs');

/* 6 - invocamos bcryptjs*/
const bcryptjs = require('bcryptjs');

/* 7 - Variables de la sesion*/

const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))

/* 8 - Invoamos al modulo de conexion de la DB*/

 const connection = require('./database/db');


 /* 9 - Estableciendo las rutas*/

app.get('/login', (req,res)=>{
    res.render('login');
})





/* 11 - Autenticación */
app.post('/auth', async(req,res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    

    if(user && pass){
        connection.query('SELECT * FROM log WHERE user = ?', [user], async(error,results)=>{
            if(results.length==0 || !(await pass==results[0].pass)){
                res.render('login',{
                    alert:true,
                    alertTitle: "Error",
                    alertMessage:"Pida las credenciales al autor",
                    alertIcon:"error",
                    showConfirmButton:true,
                    timer:false,
                    ruta:'login'
                })
            }else{
                req.session.loggedin =true;
                req.session.user = results[0].user;
                res.render('login',{
                    alert:true,
                    alertTitle: "Conexion exitosa",
                    alertMessage:"¡LOGIN CORRECTO!",
                    alertIcon:"success",
                    showConfirmButton:false,
                    timer:1500,
                    ruta:''
                });
            }
        })
    }else{
        res.render('login',{
            alert:true,
            alertTitle: "Advertencia",
            alertMessage:"Por favor ingrese un usuario y/o contraseña!",
            alertIcon:"warning",
            showConfirmButton:true,
            timer:false,
            ruta:'login'
        });
    }
})

/* 12 -Auth pages */

app.get('/', (req,res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login:true,
           
            
        })
    }else{
        res.render('login',{
            login:false,
           
            
        })
    }
})

/* 13-Logout */
app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})


app.listen(2992, (req,res)=>{
    console.log("\n\tserver running");
})





