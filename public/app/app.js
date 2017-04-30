var app = angular.module('dhtservice', ['dhtservice.controllers']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'ui',
        controller: 'UiController'
    }).otherwise({
        redirectTo: '/'
    });
}]).config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
