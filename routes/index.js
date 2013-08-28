
/*
 * GET home page.
 */
var ArticleProvider = require('../articleprovider-memory').ArticleProvider;
var articleProvider= new ArticleProvider();
exports.index = function(req, res){
  articleProvider.findAll( function( error, docs ){
    res.render( 'index.jade', {
      title: 'Blog',
      articles: docs
    });
  });
};
exports.new = function( req, res ){
  res.render( 'new.jade', { title: "New Post" } );
};
exports.create = function( req, res ){
  articleProvider.save({
    title: req.param( "title" ),
    body: req.param( "body" )
  }, function( err, docs ){
    res.redirect("/")
  });
}