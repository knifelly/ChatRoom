var express = require("express");
var app = express();
//公式
var http = require('http').Server(app);
var io = require('socket.io')(http);
//session的配置
var session = require('express-session');
//使用session
app.use(session({
	secret:'keyboard cat',
	resave:false,
	saveUninitialized:true
}));

//模板引擎
app.set("view engine", "ejs");
//静态服务
//app.use(express.static("./public"));

var alluser = [];

//中间件
//显示首页
app.get('/',function(req,res,next){
	res.render("index");
});
//确认登陆，检查此人是否有用户名，并且昵称不能重复
app.get('/check', function(req,res,next){
	var username = req.query.username;
	if(!username){
		res.send("必须填写用户名");
		return;
	}
	if(alluser.indexOf(username)!=-1){
		res.send("该用户已被注册！");
		return;
	}
	alluser.push(username);
	//付给session
	req.session.username = username;
	res.redirect("/chat");
});
//聊天室
app.get('/chat',function(req,res,next){
	if(!req.session.username){
		res.redirect("/");
		return;
	}
	res.render("chat",{
		"username" : req.session.username
	});
});

io.on("connection",function(socket){
	socket.on("dialog",function(msg){
		io.emit("dialog",msg);
	});
});


//监听
http.listen(3000, "192.168.1.6");