//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoListDB" , {useNewUrlParser: true} );

const itemsSchema = {
    name : String
};

const Item =mongoose.model("Item",itemsSchema);

const item1 = new Item({
     name : "Sanyam"
});
const item2 = new Item({
  name : "Shiv"
});
const item3 = new Item({
  name : "Shubhra"
});

const defaultItems = [item1, item2, item3];
// Item.insertMany(defaultItems,function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("successfully added");
//     }
// });
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {

// const day = date.getDate();
  Item.find({},function(err,result){
     if(result.length==0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully added");
        }
    });
      res.redirect("/");
     }
     else{
      res.render("list", {listTitle: "Today", newListItems: result});
     }
  });

 

});

app.post("/", function(req, res){

  const item = new Item({
     name :req.body.newItem
  });

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    item.save();
    res.redirect("/");
  }
});

app.post("/delete",function(req,res){
  //console.log(req.body);
  const itemId = req.body.checkbox;
  //console.log(itemId);
  Item.findByIdAndRemove(itemId,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("successfully removed");
      res.redirect("/");  
    }
  });
});
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
