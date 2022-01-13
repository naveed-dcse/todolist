const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');

const mongoose = require("mongoose");

const _=require("lodash");



// mongoose.connect("mongodb://localhost:27017/todolistDB");

mongoose.connect("mongodb+srv://admin:User%401234@cluster0.ncafq.mongodb.net/testDB?retryWrites=true&w=majority");



const itemsSchema = {
  name: String
};



const Item = mongoose.model("Item", itemsSchema);



let title = "";

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(portfunction() {
  console.log("http://localhost:3000");
});

// app.listen(3000, function() {
//   console.log("http://localhost:3000");
// });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const item1 = new Item({
  name: "Welcome to your new to do list"
});
const item2 = new Item({
  name: "Click on plus button to add new item"
});
const item3 = new Item({
  name: "Click on checkbox to mark complete"
});

const defaultItems = [item1, item2, item3];


const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {

    if (err) {
      console.log(err);
    } else {

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err) {

          if (err) {
            console.log(err);
          } else {
            console.log("Items Inserted");

          }

        });
        res.redirect("/");
      }

    }
    res.render('list', {
      listItems: "Today",
      newListItem: foundItems
    });

  });


});



app.get("/:CustomListname", function(req, res) {



const customListName=_.capitalize(req.params.CustomListname);

  List.findOne({name:customListName},function(err,foundList){
    if(!err){
      if (!foundList){
        const list=new List({name:customListName,items:defaultItems})
        list.save();
        res.redirect("/"+customListName);
      } else {
        res.render('list', {
          listItems: foundList.name,
          newListItem: foundList.items
        });

      }
    }
  })



});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName=req.body.list;

  const item = new Item({
    name: itemName
  });

if (listName==="Today"){
  item.save();
  res.redirect("/");
} else {

  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  });
}


});

app.post("/delete",function(req,res){
  const deleteItemID=req.body.checkbox;
if (req.body.listName==="Today"){
  Item.findByIdAndRemove(deleteItemID,function(err){
    console.log(err);
  })
  res.redirect("/");
} else{

  List.findOneAndUpdate({name:req.body.listName},{$pull:{items:{_id:deleteItemID}}},function(err){
    if(!err){
      res.redirect("/"+req.body.listName)
    }
  });
}

});

app.get("/about", function(req, res) {
  res.render('about');
});
