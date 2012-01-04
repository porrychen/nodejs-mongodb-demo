/**
 * Get MongoDB.
 * User: porrychen
 * Date: 12/31/11
 * Time: 2:02 PM
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// 定义三个Schema
var PagesSchema = new Schema({
    name: {type: String},
    title: {type: String},
    tags: {type: String}
});

var RoutesSchema = new Schema({
    route: {type: String},
    type: {type: String},
    template: {type: String},
    page: {type: String}
});

var UploadsSchema = new Schema({
    name: {type: String},
    path: {type: String}
});

var Pages = mongoose.model('pages', PagesSchema);

createPage = function(name, title, tags){
    var page  = new Pages();

    page.name = name;
    page.title = title;
    page.tags = tags;
    //指定插入
    page.save(function(error) {
        if (error) {
            console.log('save failed' + error);
        } else {
            console.log(name + ' page save success');
        }
    });
};

var Routes = mongoose.model('routes', RoutesSchema);

createRoute = function(r, type, template, p){
    var route  = new Routes();
    route.route = r;
    route.type = type;
    route.template = template;
    route.page = p;
    //指定插入
    route.save(function(error) {
        if (error) {
            console.log('save failed' + error);
        } else {
            console.log(r + ' path save success');
        }
    });
};

var Uploads = mongoose.model('uploads', UploadsSchema);

exports.connect = function(url){
    mongoose.connect(url);

    console.log(String(url) + ' connect success !');
};

exports.routes  = function(callback){
    // 删除
    Routes.remove({}, function(error){
        if (error) console.log(error + ' route test!');
    });

    // 添加
    createRoute('/', 'get', 'index', 'index');
    createRoute('/upload', 'post', 'upload', 'upload');

    // 查找
    Routes.find({}, function(error, rs){
        if (!error) {
            callback(null, rs);
        } else {
            callback(error);
        }
        console.log(rs);
    });
};

exports.pages = function(callback){
    // 删除
    Pages.remove({}, function(error){
        if (error) console.log(error + ' page test !');
    });

    // 添加
    createPage('index', 'One Page', 'only,ok');
    createPage('upload', 'Upload Page', 'yes,upload');

    // 查找
    Pages.find({}, function(error, pages){
        if (!error) {
            callback(null, pages);
        } else {
            callback(error);
        }
    });
};

exports.close = function(){
    mongoose.connection.close();
}