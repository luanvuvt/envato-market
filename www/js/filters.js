angular.module('starter.filters', [])
	.filter('simplifyThemeName', function () {
		return function (item) {
			return item.substring(0, 20) + '...';
		};
	})
	.filter('convertDateTime', function () {
		return function (item) {
			var d = new Date(item);

			return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
		};
	});