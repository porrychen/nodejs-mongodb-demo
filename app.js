
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var mongoose = require('./mongos'),
    formidable = require('formidable'),
    fs = require('fs'),
    util = require('util');

// print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (val.indexOf('mongodbsrc=') != -1) {
        val = val.replace('mongodbsrc=', '');
        mongoose.connect(String(val));
    }
});

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
//  app.use(express.bodyParser());
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

var startRouter = function(path, pages) {
    if (path.type == 'get') {
        app.get(path.route, function(req,res){
            console.log("app get "+path.route);
            pages.forEach(function(page) {
                if (page.name == path.page) {
                    res.render(path.template, page);//最核心的一句
                }
            });
        });
    } else {
        app.post(path.route, function(req,res, next){
            console.log("app post "+path.route + util.inspect(req));
            pages.forEach(function(page) {
                if (page.name == path.page) {
                    if (path.route == '/upload') {
                        var form = new formidable.IncomingForm(),
                            files = [],
                            fields = [];

                        form.uploadDir = './data';

//                        form
//                            .on('field', function(field, value) {
//                            console.log(field, value);
//                            fields.push([field, value]);
//                        })
//                            .on('file', function(field, file) {
//                                console.log(field, file);
//                                files.push([field, file]);
//                            })
//                            .on('end', function() {
//                                console.log('-> upload done');
////                                res.writeHead(200, {'content-type': 'text/plain'});
////                                res.write('received fields:\n\n '+util.inspect(fields));
////                                res.write('\n\n');
////                                res.end('received files:\n\n '+util.inspect(files));
//                            });
//                        form.parse(req);

//                        res.render(path.template, page);

                        form.parse(req, function(error, fields, files) {
                            var filepath     = files['upload']['path'],
                                filename = files['upload']['filename'],
                                mime     = files['upload']['mime'];
                            console.log('upload file : ' + filepath);
                            fs.renameSync(filepath, './data/test.gif');

                            page.imgsrc = './data/test.gif';

                            res.headerSent;
                            console.log(page.imgsrc);
                            res.render(path.template, page);
                        });


                    } else {
                        console.log('not upload file')
                        res.render(path.template, page);
                    }
                }

            });

        });
    }

};

mongoose.pages(function(error, ps){
    if (!error) {
        mongoose.routes(function(error, rs){
            // rs 返回数据库的信息
            if (!error) {
                rs.forEach(function(r){
                    startRouter(r, ps);
                });
            }
        });
    }
});

//app.get('/', routes.index);

//app.post('/upload1', function(req, res){
//    console.log(req.body.user);
//    res.redirect('back');
//});
//
//app.get('/', function(req, res){
//    res.send('<form method="post" enctype="multipart/form-data">'
//        + '<p>Image: <input type="file" name="image" /></p>'
//        + '<p><input type="submit" value="Upload" /></p>'
//        + '</form>');
//});



//app.post('/', function(req, res, next){

    // connect-form adds the req.form object
    // we can (optionally) define onComplete, passing
    // the exception (if any) fields parsed, and files parsed


//    req.form.complete(function(err, fields, files){
//        if (err) {
//            next(err);
//        } else {
//            console.log('\nuploaded %s to %s'
//                ,  files.image.filename
//                , files.image.path);
//            res.redirect('back');
//        }
//    });
//
//    // We can add listeners for several form
//    // events such as "progress"
//    req.form.on('progress', function(bytesReceived, bytesExpected){
//        var percent = (bytesReceived / bytesExpected * 100) | 0;
//        process.stdout.write('Uploading: %' + percent + '\r');
//    });

//    var form = new formidable.IncomingForm();
//    form.uploadDir = './data';

//    form
//        .on('field', function(field, value) {
//        console.log(field, value);
////        fields.push([field, value]);
//    })
//        .on('file', function(field, file) {
//            console.log(field, file);
////            files.push([field, file]);
//        })
//        .on('end', function() {
//            console.log('-> upload done');
////                                res.writeHead(200, {'content-type': 'text/plain'});
////                                res.write('received fields:\n\n '+util.inspect(fields));
////                                res.write('\n\n');
////                                res.end('received files:\n\n '+util.inspect(files));
//        });
//    form.parse(req);
//});

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
