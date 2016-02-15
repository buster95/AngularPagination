
angular.module('ngPagination', []).

filter('startFrom', function() {
    return function(input, inicio) {
        inicio = +inicio;
        return input.slice(inicio);
    }
}).

service('$paginationService', function(){
}).

directive('ngPagination', function($parse, $compile, $timeout){

	var getVarName = function (RepeatValue) {
		var variable = RepeatValue.replace(' in ','~');
		var variable = variable.replace(' | ','~');
		var variable = variable.replace('|','~');
		var variable = variable.split('~');
		return variable[1].replace(' ','');
	}

	return {
		priority: 100,
	    restrict: 'A',
		scope: false,
		compile: function(tElement, tAttrs) {
			tElement.attr('ng-pagination',atributo + " | startFrom:pageSize");
			var atributo = tElement.attr('ng-pagination');
			tElement.attr('ng-repeat', atributo);
			tElement.removeAttr('ng-pagination');

			return function(scope, element, attr){
				scope.pageCurrent = 1;
				scope.pageSize = 5;
				scope.pages = 1;
				var size = Number(element.attr('ng-page-size')) + 0;
				if(angular.isDefined(element.attr('ng-page-size'))
					&& angular.isNumber(size) && size > 0){
					console.log('encontrado');
					scope.pageSize = Number(element.attr('ng-page-size'));
				}else{
					console.log('no encontrado');
					scope.pageSize = 5;
				}

				var compilado = $compile(element)(scope);
			}
		}
		// ,
		// controller: function($scope, $element, $attrs) {
		// }
		// ,
		// link: function(scope, element, attr) {
		// 	console.log(getVarName(attr.ngRepeat));
		// 	scope.pageSize = '5';
		// }
	};
})