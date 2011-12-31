
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var mongoose = require('./mongos');

// print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (val.indexOf('mongodbsrc=') != -1) {
        val = val.replace('mongodbsrc=', '');
        mongoose.connect(String(val));
    }
});

var mongorouters = mongoose.routes;
var mongopages = mongoose.pages;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

var startRouter = function(path) {
    app.get(route, function(req,res){
        console.log("Connect to "+path);
        for (page in mongopages) {
            if (page.name == path.page) {
                res.render(path.template, page);//最核心的一句
            }
        }
    });
};

console.log(mongorouters);
for(route in mongorouters){//如果直接for循环而不是调用函数，你就会发现route永远是最后一个
    console.log(route);
//    startRouter(route);
}

//app.get('/', routes.index);

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
