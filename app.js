
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

// print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (val.indexOf('mongodbsrc=') != -1) {
        val = val.replace('mongodbsrc=', '');
        mongoose.connect(String(val));

        console.log(String(val) + ' connect success !');
    }
});

var TestSchema = new Schema({
    name        : {type : String}
    ,age       : {type : String}
});

var coll_name = 'user';//表名

var USER  = mongoose.model(coll_name, TestSchema);

// 修改
USER.find({ name: 'genedna'},function(err, users) {
    if (!err) {
        users.forEach(function(user){
            user.age = '2008';
            user.save();
        });
    }
});

// 查询
USER.find({name:/^cbl/},function(err, users) {
    if (!err) {
        users.forEach(function(user){
            console.log(user);
        });

        var user  = new USER();
        user.name = 'cbl' + users.length;
        user.age = '2000';
        //指定插入
        user.save(function(err) {
            if (err) {
                console.log(err);
                console.log('save failed');
            } else {
                console.log('save success');
            }
        });
    }
});

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

app.get('/', routes.index);

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
