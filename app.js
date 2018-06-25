const express = require("express");
const app = express()
const mysql = require("mysql")
const bodyParser= require('body-parser')
var multer  = require('multer');
var path = require('path');

var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'uploads/')
	},
	filename:function(req,file,cb){
		cb(null, Date.now() + file.originalname);		
	}
});

var upload = multer({ storage: storage});

app.use("/bootstrap",express.static(__dirname+"/bootstrap"));
app.use("/uploads",express.static(__dirname+"/uploads"));
//app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"root",
	database:"node_mysql",
	port: '8889'
});


app.listen(3000,function(){
	console.log("Listening on 3000 ...");
});

app.get("/",function(req,res){
	con.query("select * from libro",function(error,result){
		res.render("home.ejs",{lista:result});
	});
});

app.get("/nuevo",function(req,res){
	res.render("new.ejs",{});
});

app.post("/guardar", upload.any(), function(req,res){
	var tit = req.body.libro.titulo;
	var rsu = req.body.libro.resumen;
	var fec = req.body.libro.fecha;
	var img = req.files[0].filename;
	console.log(img);
	con.query("insert into libro (titulo,resumen,fecha, imagen) value (\""+tit+"\",\""+rsu+"\",\""+fec+"\",\""+img+"\")",function(error,result){
	});
	res.redirect("/");
});

app.get("/editar/:libroid",function(req,res){
	con.query("select * from libro where id="+req.params.libroid,function(error,result){
		res.render("edit.ejs",{libro:result[0]});
	});
});

app.post("/actualizar", upload.any(), function(req,res){
	var id = req.body.libro.id;
	var tit = req.body.libro.titulo;
	var reu = req.body.libro.resumen;
	var fec = req.body.libro.fecha;
	var img = req.files[0].filename;
	con.query(" update libro set titulo=\""+tit+"\",resumen=\""+reu+"\",fecha=\""+fec+"\",imagen=\""+img+"\" where id="+id,function(error,result){
	});
	res.redirect("/");
});

app.get("/eliminar/:libroid",function(req,res){
	con.query("delete from libro where id="+req.params.libroid,function(error,result){
	});
	res.redirect("/");
});
