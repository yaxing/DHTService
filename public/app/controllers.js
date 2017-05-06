var controllers = angular.module('dhtservice', ['ngAnimate', 'treasure-overlay-spinner']);

controllers.controller('DataController', ['$scope', '$http', '$interval', 'dateFilter', function($scope, $http, $interval, dateFilter) {

    $scope.data = {};

    $scope.spinner = {
        active: false,
        on: function () {
            this.active = true;
        },
        off: function () {
            this.active = false;
        }
    };

    $scope.spinner.on();

    timer = $interval(function() {
        $scope.time = dateFilter(new Date(), 'M/d/yy h:mm:ss a');
    }, 1000);

    loader = $interval(function() {
        $http({
            method : "GET",
            url : "api/data"
        }).then(function mySucces(response) {
            $scope.data = response.data;
            console.log($scope.data);
            $scope.spinner.off();
        }, function myError(response) {
            $scope.error = response.data.message;
            console.log($scope.error);
        });
    }, 1000);

    $scope.$on('$destroy', function() {
        if (angular.isDefined(loader)) {
            $interval.cancel(loader);
            loader = undefined;
        }
        if (angular.isDefined(timer)) {
            $interval.cancel(timer);
            timer = undefined;
        }
    });
}]);
