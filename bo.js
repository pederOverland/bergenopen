window.jQuery = require('jquery'),
	_ = require('lodash'),
	angular = require('angular');
require('bootstrap');

var app = angular.module('bo', [require('angular-route')]);

app.controller({
	programCtrl: ['$scope', 'events', function($scope, events) {
		_.forEach(events, function(ev) {
			ev.start = new Date(ev.start);
			ev.end = new Date(ev.end);
		});
		$scope.events = events;
		function setCurrent () {
			var now = new Date();
			$scope.currentevent = _.find(events, function(ev) {
				return ev.start < now && ev.end > now;
			});
			$scope.nextevent = _.filter(events, function(ev) {
				return ev.start > now;
			})[0];
			$scope.today = _.filter(events, function(ev) {
				return ev.start.getDate() == now.getDate();
			});
		}
		setCurrent();
	}]
})

app.value('events', require('./events.json'));

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'partials/program.html',
			controller: 'programCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);