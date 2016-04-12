var mainApplicationModuleName = 'mean';

// create main module of angular application
var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngRoute', 'users', 'example']);

// implemented hashbangs for improving SEO
mainApplicationModule.config(['$locationProvider', function ($locationProvider) {
  $locationProvider.hashPrefix('!');
}]);

// add a hash part tot he application's URL after the OAuth authentication round-trip
if (window.location.hash === '#_=_') {
  window.location.hash = '#!';
}

// manually set main application on document
angular.element(document).ready(function () {
  angular.bootstrap(document, [mainApplicationModuleName]);
});