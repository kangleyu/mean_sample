angular.module('users').factor('Authentication', [function () {
  this.user = window.user;
  
  return {
    user: this.user
  };
}]);