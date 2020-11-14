const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { stringify } = require("querystring");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true});

const articleschema = {
    title : String ,
    content : String
};

const Article = mongoose.model("Article" , articleschema);

app.route("/articles")
    .get(function(req,res){
        Article.find(function(err ,foundarticles){
            if(!err){
                res.send(foundarticles);
            }
            else{
                res.send(err);
            }    
        });
    })
    .post(function(req ,res){
    
        const newarticle = new Article ({
            title: req.body.title ,
            content: req.body.content
        });
        newarticle.save(function(err){
            if(!err){
                res.send("success");
            }
            else{
                res.send(err);
            }
        });
    
    })
    .delete(function(req , res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("deleted articles");
            }
            else
            {
                res.send(err);
            }
        });
    });

app.route("/articles/:articletitle")
    .get(function(req,res){
        Article.findOne({title:req.params.articletitle},
            function(err,foundarticle){
                if(foundarticle){
                    res.send(foundarticle);
                }
                else{
                    res.send("no article found");
                }
            });
    })

    .put(function(req , res){
        Article.update(
            {title: req.params.articletitle},
            {title : req.body.title , content: req.body.content},
            {overwrite:true},
            function(err){
                if(!err){
                    res.send("successfully updated");
                }
                else{
                    res.send("unsuccessful");
                }
            }
        );
    })

    .patch(function(req , res){
        Article.update(
            {title: req.params.articletitle},
            {$set : req.body},
            function(err){
                if(!err){
                    res.send("successfully updated");
                }
                else{
                    res.send("unsuccessful");
                }
            }
        );
    })

    .delete(function(req , res){
        Article.deleteOne(
            {title:req.params.articletitle},
            function(err){
                if(!err){
                    res.send("success");
                }
                else{
                    res.send(err);
                }
            }
        );
    });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});