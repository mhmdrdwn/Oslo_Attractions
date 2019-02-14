var express= require("express");
var bodyParser=require("body-parser");
var app= express();
var mongoose=require("mongoose");
var methodOverride=require("method-override");
//var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost:27017/places_app", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
//app.use(expressSanitizer);

//mongoose config
var placeSchema = new mongoose.Schema({
	title: String,
	image: String,
	//image: {type: String, default: "defaultImage.jpg"}
	body : String,
	address: String,
	//created: {type: Date, default: Date.now}
});
var Places= mongoose.model("Place", placeSchema);

// Very First CREATE
//Place.create({
//	title:"Frogner Park",
//	image:"https://cdn.pixabay.com/photo/2015/02/26/10/11/sculpture-650104_960_720.jpg",
//	body:"Frogner Park is a public park located in the borough of Frogner in Oslo, Norway, and is historically part of Frogner Manor. The manor house is located in the south of the park, and houses the Oslo City Museum. Both the park, the entire borough of Frogner as well as Frognerseteren derive their names from Frogner Manor.",
//	address:"Kirkeveien, 0268 Oslo"
//});

//console.log("here")
// RESTful Routes
// INDEX Route
app.get("/", function(req, res){
	res.redirect("/places");
});
app.get("/places", function(req, res){
	//console.log("here");
	Places.find({}, function(err, places){
		if(err){
			console.log("Error");
		}else{
			res.render("index", {places:places});	
		}
	});
		
});


//NEW Route
app.get("/places/new", function(req, res){
	res.render("new");
	
});

//CREATE Route
app.post("/places", function(req, res){
	// sanitizing the code
	//req.body.place.body=req.sanitize(req.body.place.body);
	Places.create(req.body.place, function(err, newPlace){
		if(err){
			res.render("new");
		}else{
			res.redirect("/places");
		}
	});
});

//SHOW Route
app.get("/places/:id", function(req, res){
	//res.send("test");
	Places.findById(req.params.id, function(err, foundPlace ){
		if(err){
			res.redirect("/places");
		}else{
			res.render("show",{place:foundPlace});
		}	
	});
});

//EDIT Route
app.get("/places/:id/edit", function(req, res){
	Places.findById(req.params.id, function(err, foundPlace){
		if(err){
			res.redirect("/places");
		}else{
			res.render("edit", {place:foundPlace})
		}
	});
});

//UPDATE Route
app.put("/places/:id", function(req, res){
	//res.send("Updating");
	  // sanitizing the code
        //req.body.place.body=req.sanitize(req.body.place.body);
	Places.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace){
		if(err){
			res.redirect("/places");
		}else{
			res.redirect("/places/"+req.params.id);
		}
	});
});

//DESTROY Route
app.delete("/places/:id", function(req, res){
	//res.send("Delete Route");
	Places.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/places");
		}else{
			res.redirect("/places");
		}	
	});

});

app.listen(3000, function(){
	console.log("server is up");
});
