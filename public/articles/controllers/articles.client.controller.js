angular.module('articles').controller('ArticlesController', 
['$scope', '$routeParams', '$location', 'Authentication', 'Articles', 
function ($scope, $routeParams, $location, Authentication, Articles) {
  $scope.authentication = Authentication;
  
  // create handler for angular controller
  $scope.create = function () {
    var article = new Articles({
      title: this.title,
      content: this.content
    });
    
    article.$save(function (response) {
      $location.path('articles/' + response._id);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };
  
  // get list of articles 
  $scope.find = function() {
    $scope.articles = Articles.query();
  };
  
  $scope.findOne = function() {
    $scope.article = Articles.get({ articleId: $routeParams.articleId });
  };
  
  // update article
  $scope.update = function() {
    $scope.article.$update(function(){
      $location.path('articles/' + $scope.article._id);
    }, function(errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  };
  
  // delete article
  $scope.delete = function(article) {
    if (article) {
      article.$remove(function(){
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i,1);
          }
        }
      });
    } else {
      $scope.article.$remove(function(){
        $location.path('articles');
      });
    }
  }
  
}]);