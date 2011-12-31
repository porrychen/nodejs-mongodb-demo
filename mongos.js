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
    template: {type: String},
    page: {type: String}
});

var UploadsSchema = new Schema({
    name: {type: String},
    path: {type: String}
});

var Pages = mongoose.model('pages', PagesSchema);

createPage = function(){
    var page  = new Pages();

    page.name = 'index';
    page.title = 'One Page';
    page.tags = 'only,ok';
    //指定插入
    page.save(function(error) {
        if (error) {
            console.log('save failed' + error);
        } else {
            console.log('save success');
        }
    });
};

var Routes = mongoose.model('routes', RoutesSchema);

createRoute = function(){
    var route  = new Routes();
    route.template = 'index';
    route.page = 'index';
    //指定插入
    route.save(function(error) {
        if (error) {
            console.log('save failed' + error);
        } else {
            console.log('save success');
        }
    });
};

var Uploads = mongoose.model('uploads', UploadsSchema);

exports.connect = function(url){
    mongoose.connect(url);

    console.log(String(url) + ' connect success !');

    getRoutes();
    getPages();
};

var routes = {};
getRoutes = function(){
    // 删除
//    Routes.remove({page : 'index'}, function(error){
//        console.log(error + ' route test!');
//    });

    // 添加
//    createRoute();

    // 查找
    Routes.find({}, function(error, rs){
        if (!error) {
            rs.forEach(function(r){
                console.log(r);
                routes[r.template] = r;
            });
        }
        console.log(routes);
    });
};

exports.routes = routes;

getPages = function(){
    // 删除
//    Pages.remove({name : 'index'}, function(error){
//        console.log(error + ' page test !');
//    });

    // 添加
//    createPage();

    // 查找
    Pages.find({}, function(error, pages){
//        if (!error) {
//            return pages;
//        } else {
//            return null;
//        }
    });
};

exports.pages = {};

exports.close = function(){
    mongoose.connection.close();
}