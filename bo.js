window.jQuery = require('jquery');
var _ = require('lodash');
var angular = require('angular');
var moment = require('moment');
require('bootstrap');

var app = angular.module('bo', [require('angular-route')]);

app.run(['$rootScope', '$interval', '$location', '$timeout', function($rootScope, $interval, $location, $timeout) {
	$rootScope.active = function(target) {
		return target == $location.path();
	};
	jQuery(window.applicationCache).bind('cached', function() {
		$rootScope.showCached = true;
		$rootScope.$apply();
		$timeout(function() {
			$rootScope.showCached = false;
		}, 5000);
	});
	$rootScope.$on('$routeChangeStart', function() {
		if($rootScope.heartbeat){
			$interval.cancel($rootScope.heartbeat);
		}
		jQuery('#bs-example-navbar-collapse-1').collapse('hide');
	});
}]);

app.controller({
	defaultCtrl: [function() {}],
	programCtrl: ['$scope', 'events', '$interval', function($scope, events, $interval) {
		_.forEach(events, function(ev) {
			ev.start = moment(ev.start);
			ev.end = moment(ev.end);
		});
		$scope.events = events;
		$scope.days = {
			'Wednesday': _.filter(events, function(ev) {
				return ev.start.format('dddd') === 'Wednesday';
			}),
			'Thursday': _.filter(events, function(ev) {
				return ev.start.format('dddd') === 'Thursday';
			}),
			'Friday': _.filter(events, function(ev) {
				return ev.start.format('dddd') === 'Friday';
			}),
			'Saturday': _.filter(events, function(ev) {
				return ev.start.format('dddd') === 'Saturday';
			}),
			'Sunday': _.filter(events, function(ev) {
				return ev.start.format('dddd') === 'Sunday';
			}),
		};

		function setCurrent() {
			var now = moment(); //events[9].start.clone().add(1, 'minutes');
			$scope.currentevent = _.find(events, function(ev) {
				return ev.start < now && ev.end > now;
			});
			$scope.nextevent = _.filter(events, function(ev) {
				return ev.start > now;
			})[0];
		}
		setCurrent();
		$scope.$root.heartbeat = $interval(function() {
			setCurrent();
		}, 10000);
	}]
});

app.filter('moment', function() {
	return function(input, args) {
		return input.format(args);
	};
});

app.directive('eventSpot', [function() {
	return {
		restrict: 'A',
		replace: true,
		transclude: true,
		scope: {
			event: '=eventSpot'
		},
		link: function(scope, element, attrs) {

		},
		templateUrl: 'partials/eventSpot.html'
	};
}]).directive('day', [function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			events: '=',
			day: '='
		},
		link: function(scope, element, attrs) {},
		templateUrl: 'partials/day.html'
	};
}]);

app.value('events', require('./events.json'));

app.config(['$routeProvider','$locationProvider',
	function($routeProvider, $locationProvider) {
		$locationProvider.hashPrefix('');
		$routeProvider.
		when('/', {
			templateUrl: 'partials/program.html',
			controller: 'programCtrl'
		}).
		when('/contact', {
			templateUrl: 'partials/contact.html',
			controller: 'defaultCtrl'
		}).
		when('/clubs', {
			templateUrl: 'partials/clubs.html',
			controller: 'defaultCtrl'
		}).
		when('/meals', {
			templateUrl: 'partials/meals.html',
			controller: 'defaultCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);