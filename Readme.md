AngularPagination Module
=====================

### USO DEL MODULO ###

**Modulo** `ngPagination`

```javascript
angular.module('myapp',['ngStorage']).
controller('ctrlmain', function($scope){
	$scope.usuarios = [{id: 1, nombre:'Walter'},{id:2 , nombre:'Andrea'},{id:3, nombre:'Axel'}];
});
```

### DIRECTIVAS ###
* **ng-pagination="user in usuarios"**

> Directiva para crear la pagination el modulo la sustituye por una directiva ng-repeat
se puede usar la directiva ng-pagination-size para definir el numero de elementos por pagina
el modulo toma por defecto

```html
<li ng-pagination="user un usuarios">{{user.nombre}}</li>
<li ng-pagination="user un usuarios" ng-pagination-size="1">{{user.nombre}}</li>
```

* **ng-pagination-control**

> Esta directiva solo se puede utilizar como elemento y es necesario que vaya precedida por una
propiedad llamada **pagination-id="usuarios"** este parametro debe ser el nombre de la variable
que se esta paginando

```html
<ng-pagination-control pagination-id="usuarios"></ng-pagination-control>
```

* **$storage.cookies**

> Nos permite acceder a las cookies en caso de no estar activado nos mandara una exception

	1. $storage.cookie.set('key',value);

	Nos permite guardar una variable en las cookies

	2. $storage.cookie.get('key');

	Nos retorna el valor de una variable en las cookies por su key

	3. $storage.cookie.remove('key');

	Nos elimina una variable de las cookies por su key

	4. $storage.cookie.removeAll();

	Nos limpia las cookies elimina todo

	5. $storage.cookie.bindScope($scope, 'key');

	Nos hace un binding de una variable en las cookies con una
	variable del mismo nombre en el $scope, si es modificada en el $scope
	se modifica en la cookie

	6. $storage.cookie.setDomain('domain');

	7. $storage.cookie.setMaxAge(age_number_seg);

	8. $storage.cookie.setPath('path');