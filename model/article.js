var mongodb = require("mongodb")
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSON;
var ObjectID = mongodb.ObjectID;
ArticleProvider = function( host, port ){
  this.db = new Db( "node_mongo_blog", new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){})
};
ArticleProvider.prototype.getCollection = function( callback ){
  this.db.collection( 'articles', function( error, article_collection ){
    if( error ) callback( error );
    else callback( null, article_collection );
  } );
};
ArticleProvider.prototype.findAll = function( callback ){
  this.getCollection( function( error, article_collection ){
    if( error ) callback( error )
    else {
      article_collection.find().toArray( function( error, results ){
        if( error ) callback( error )
        else callback( null, results )
      })
    }
  } );
};
ArticleProvider.prototype.findById = function( id, callback ){
  this.getCollection( function( error, article_collection ){
    if( error ) callback(error)
    else {
      article_collection.findOne( { _id: new ObjectID(id) }, function( error, result ){
        if( error ) callback(error)
        else callback( null, result )
      } );
    }
  });
};
ArticleProvider.prototype.save = function( articles, callback ){
  this.getCollection( function( error, article_collection ){
    if( error ) callback( error )
    else {
      if( typeof(articles.length)=="undefined")
        articles = [articles];
      for( var i=0; i < articles.length; i++ ){
        article = articles[i];
        articles.created_at = new Date();
        if( article.comments === undefined ) article.comments = [];
        for( var j = 0; j < article.comments.length; j++ ){
          article.comments[j].created_at = new Date();
        };
      }
      article_collection.insert( articles, function(){
        callback( null, articles)
      });
    }
  });
}
exports.ArticleProvider = ArticleProvider;