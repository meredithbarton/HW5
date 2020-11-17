var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var bodyParser = require('body-parser');

app.set('port', 3212);

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

function collectValues(req){
  var pairs = []
  var keys = [];
  var values = [];
  for (var p in req.query){
  keys.push(p);
  values.push(req.query[p]);
  }
  pairs.key = keys
  pairs.value = values
  return pairs
}

function collectBodyValues(req){
  var pairs = []
  var keys = [];
  var values = [];
  for (var p in req.body){
  keys.push(p);
  values.push(req.body[p]);
  }
  pairs.bodyKey = keys
  pairs.bodyValue = values
  return pairs
}

app.get('/', (req, res) => {
  res.render('GETres', collectValues(req));
});

app.post('/',(req, res) => {
  var query_pairs
  var body_pairs
  // send a request containing both body and query
  if (Object.keys(req.body).length == 0
    && Object.keys(req.query).length == 0){
    query_pairs = collectValues(req);
    body_pairs = collectBodyValues(req);
    var all_pairs = [];
    all_pairs.query_pairs = query_pairs;
    all_pairs.body_pairs = body_pairs;
    res.render('POSTres', all_pairs);
    // if no body, send query
  }else if (Object.keys(req.body).length == 0){
    console.log("check");
    // if no query, send body
    res.render('POSTres', collectValues(req));
  }else if (Object.keys(req.query).length == 0) {
    res.render('POSTres', collectBodyValues(req));
  }
});

app.listen(app.get('port'), function(req, res){
  console.log('Express started on http://localhost:' + app.get('port') +
  '; press Ctrl-C to terminate.');

});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});
