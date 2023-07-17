//Create web server
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var comments = require("./comments.json");
var id = comments.length;

//Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Routes
app.get("/comments", function(req, res){
    res.json(comments);
});

app.post("/comments", function(req, res){
    var comment = req.body;
    comment.id = id++;
    comments.push(comment);
    fs.writeFile("comments.json", JSON.stringify(comments), function(err){
        res.json(comment);
    });
});

app.delete("/comments/:id", function(req, res){
    comments = comments.filter(function(comment){
        return comment.id !== parseInt(req.params.id);
    });
    fs.writeFile("comments.json", JSON.stringify(comments), function(err){
        res.json({success: true});
    });
});

app.put("/comments/:id", function(req, res){
    var comment = comments.filter(function(comment){
        return comment.id === parseInt(req.params.id);
    })[0];
    comment.body = req.body.body;
    fs.writeFile("comments.json", JSON.stringify(comments), function(err){
        res.json(comment);
    });
});

//Start server
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});