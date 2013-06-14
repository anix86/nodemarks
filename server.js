var express = require('express');
//var jsdom = require('jsdom');
var url = require('url');
var request = require('request');
var mongo = require('mongoskin');
var conn = mongo.db('user:pass@staff.mongohq.com:10011/mongo-collectionname');
var cheerio = require('cheerio');

var app =  module.exports = express();

app.configure(function() {
 // app.set('port', process.env.PORT || 3000);  
  app.set('view options', {  layout: false });
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);  
  app.use(express.static( __dirname + '/public'));   
	
});




app.get('/', function(req, res){
  
  conn.collection('bookmarks').find().toArray(function(err, items){
     if(err) throw err;

    //res.writeHead(200, {'Content-Type': 'text/plain'});    
   // res.end(JSON.stringify(items) + items.length);
    
    res.render('index', {
            title: "Bookmarks",
            items: items
          });  
          
  });
  
});
 
app.post('/save', function(req, res){
 
 
  console.log(JSON.stringify(req.body));
  // res.writeHead(200, {'Content-Type': 'text/plain'});    
	var user_details = { name: "anix", avatar: "some image", email_id: "anix86@gmail.com" }
    var doc = { 
		title : req.param('title'), 
		description : req.param('description'), 
		url : req.param('url'),
		tags : "",
		category : req.param('category'),
		created : new Date('03/28/2009'),
		user: user_details };
	//var doc = {title : "test", description: "Test"};
	conn.collection('bookmarks').insert(doc, function(){
		res.writeHead(200, {'Content-Type': 'text/html'});    
		res.end( "<html><title>Nodemarks : Submitted </title><body>redirecting... <script>location.href='/'</script></body></html>" );
	});

	//console.log(doc)  
});

app.post('/comment', function(req, res){
 
 
  console.log(JSON.stringify(req.body));
  // res.writeHead(200, {'Content-Type': 'text/plain'});    
	/*var user_details = { name: "anix", avatar: "some image", email_id: "anix86@gmail.com" }
    var doc = { 
		title : req.param('title'), 
		description : req.param('description'), 
		url : req.param('url'),
		tags : "",
		category : req.param('category'),
		created : new Date('03/28/2009'),
		user: user_details };
	*/
	console.log(req.param('id'));
	var user_details = { name: "anix", avatar: "some image", email_id: "anix86@gmail.com" }
	var post = conn.collection('bookmarks').find({"_id": req.param('id')});
	//post.comments = [{text:req.param('comment'), user:user_details}]
	console.log( "Post = " + post.title);
	//post.category = "news";
	conn.collection('bookmarks').save(post);
	
	//console.log(doc)  
});

app.get('/new', function(req, res){
  
		res.render('bookmark', {
            title: "Create Bookmarks",
           
          });
  
});


   
app.get('/show/:name?', function(req, res){
  
  conn.collection('bookmarks').find({title: req.params.name}).toArray(function(err, items){
      
    if(err) throw err;
    
    //
    if( items.length >0){
        
        res.render('layout', {
            title: "time",
            item: items
          });
          
        //res.end(JSON.stringify(items) + items.length);
        
    }else{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("No Records Found.");
    }
  });
  
});


app.get('/nodetube', function(req, res){


request('http://www.techgearz.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.

	jsdom.env({
                        html: body,
                        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
                }, function(err, window){
         //Use jQuery just as in a regular HTML page
                        var $ = window.jQuery;
                         
                        console.log($('title').text());
                        res.end($('title').text());
                });

  }
		
});

});



app.get('/u',function(req,res){

console.log(1)
request('http://techgearz.com', function(error, response, body) {
  // Hand the HTML response off to Cheerio and assign that to
  //  a local $ variable to provide familiar jQuery syntax.
	console.log(body)
  var $ = cheerio.load(body);
  console.log($('meta[name=description]').attr("content"))
  // Exactly the same code that we used in the browser before:
  $('title').each(function() {
    console.log($(this).text());
  });

		res.writeHead(200, {'Content-Type': 'application/json'});  
		res.end("j");
});


});


app.get('/geturldetails', function(req, res){

	console.log(req.param('url'));
	request(req.param('url'), function (error, response, body) {

		try{
		  

			var $ = cheerio.load(body);
								
			res.writeHead(200, {'Content-Type': 'application/json'});  
			var j = "{\"title\":\"" + $('title').text() + "\",";
			j += "\"text\":\"" + $('meta[name=description]').attr("content") + "\"}";
			//j += "\"image\":\"" + $('img')[0].attr("src") + "\"}";
			res.end(j);

		  
		}catch(e){
			var j = "{\"title\":\"error\",";
			j += "\"text\":\""+e+"\"}";
			res.writeHead(200, {'Content-Type': 'application/json'});  
			res.end(j);
		}		
	});

});

app.get('/geturldetails1', function(req, res){
		var j = "{\"title\":\"Test\",";
			j += "\"text\":\"live\"}";
			res.writeHead(200, {'Content-Type': 'application/json'});  
			res.end(j);
});



app.listen(process.env.VCAP_APP_PORT || 3000);
console.log("Server Started at 3000");
