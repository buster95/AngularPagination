<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<title>Paginar Ejemplo con Angular</title>
</head>
<body ng-app="myapp">
<h1>Paginado con AngularJS</h1>
<h1>AngularJS Avanzado</h1>

<div ng-controller="ctrlpaginado">
	<input type="text" ng-pagination-search="personas">
	<ul ng-pagination="p in personas" ng-pagination-size="2">
		<li> {{p.nombre}} {{p.apellido}} </li>
	</ul>
	<ng-pagination-control pagination-id="personas"></ng-pagination-control>
</div>


<script type="text/javascript" src="javascript/angular.min.js"></script>
<script type="text/javascript" src="javascript/angular-pagination.js"></script>
<script type="text/javascript">
	var app = angular.module('myapp', ['ngPagination']);
	app.controller('ctrlpaginado', function($scope, $http){
		$scope.personas=[];
		$http.get('servicio.php').success(function (response) {
			$scope.personas=response;
		});
	});
</script>

</body>
</html>