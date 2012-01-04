var express = require('express'),
    util = require('util'),
    formidable = require('formidable'),
    server;

server = module.exports = express.createServer(function(req, res) {
  if (req.url == '/') {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="upload" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  } else if (req.url == '/upload') {
      console.log(util.inspect(req));

      startForm(req, res);
  } else {
    res.writeHead(404, {'content-type': 'text/plain'});
    res.end('404');
  }
});
server.listen(5000);

server.post('/upload', function(req, res) {
    console.log('req : ++++++++ \n ' + util.inspect(req));

//    startForm(req, res);
});

startForm = function(req, res) {
    var form = new formidable.IncomingForm(),
        files = [],
        fields = [];

    form.uploadDir = './data';

    form
        .on('field', function(field, value) {
        console.log(field, value);
        fields.push([field, value]);
    })
        .on('file', function(field, file) {
            console.log(field, file);
            files.push([field, file]);
        })
        .on('end', function() {
            console.log('-> upload done');
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received fields:\n\n '+util.inspect(fields));
            res.write('\n\n');
            res.end('received files:\n\n '+util.inspect(files));
        });
    form.parse(req);
}

console.log('listening on http://localhost:'+5000+'/');
