var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var sanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(sanitizer());

var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});

var blog=mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
});

// Read
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err) console.log(err);
        else{
            res.render("index",{blogs:blogs});
        }
    });
});

// Create
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    blog.create(req.body.blog,function(err,newblog){
        if(err) res.render("new");
        else{
            res.redirect("/blogs");
        }
    });
});

// Read
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
       if(err) res.redirect("/blogs");
       else{
          res.render("show",{blog:foundblog});
       }
    });
});

// Update
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err) res.redirect("/blogs");
        else{
            res.render("edit",{blog:foundblog});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err) res.redirect("/blogs");
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// Destroy
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs");
    }); 
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The server is running!"); 
});