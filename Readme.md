AngularPagination Module
=====================

### USO DEL MODULO ###

**Modulo** `ngPagination`

```javascript
angular.module('myapp',['ngPagination']).
controller('ctrlmain', function($scope){
	$scope.usuarios = [{id: 1, nombre:'Walter'},{id:2 , nombre:'Andrea'},{id:3, nombre:'Axel'}];
});
```

### DIRECTIVAS ###
* **ng-pagination="user in usuarios"**

> Directiva para crear la pagination el modulo la sustituye por una directiva ng-repeat
se puede usar la directiva ng-pagination-size para definir el numero de elementos por pagina
el modulo toma el **numero de elementos por pagina** como **5** por defecto

```html
<li ng-pagination="user in usuarios">{{user.nombre}}</li>
<li ng-pagination="user in usuarios" ng-pagination-size="1">{{user.nombre}}</li>
```

* **ng-pagination-control**

> Esta Directiva solo se puede utilizar como elemento y es necesario que vaya precedida por una
propiedad llamada **pagination-id="usuarios"** este parametro debe ser el nombre de la variable
que se esta paginando

```html
<ng-pagination-control pagination-id="usuarios"></ng-pagination-control>
```

* **ng-pagination-search**

> Esta Directiva se utiliza como atributo se pasa como
valor el nombre de la variable de los datos

**ng-pagination-search="usuarios"** solo puede ser utilizada por los elementos input

```html
<input ng-pagination-search="usuarios" style="" class="form-control">
```

### EJEMPLO ###
> Añadimos ngPagination a nuestro modulo de la aplicacion una vez añadido es simple podemos
comenzar a hacer uso de nuestras Directivas

```javascript
angular.module('myapp',['ngPagination']).
controller('ctrlmain', function($scope){
	$scope.usuarios = [{id: 1, nombre:'Walter'},{id:2 , nombre:'Andrea'},{id:3, nombre:'Axel'}];
});
```

> Este seria el codigo que tendriamos en nuestro html

```html
<div ng-controller="ctrlmain">
	<input ng-pagination-search="usuarios">

	<li ng-pagination="user in usuarios" ng-pagination-size="1">{{user.nombre}}</li>

	<ng-pagination-control pagination-id="usuarios"></ng-pagination-control>
</div>
```