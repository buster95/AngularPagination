AngularStorage Module
=====================

### USO DEL MODULO ###
**Modulo** `ngStorage`

**Servicio** `$storage`

```javascript
angular.module('myapp',['ngStorage']).
controller('ctrlmain', function($scope, $storage){

});
```

### METODOS Y SUBMETODOS ###
* **$storage.local**

> Nos permite acceder al LocalStorage del navegador en caso de que este
no este habilitado nos guarda el dato en las cookies

	1. $storage.local.set('key',value);

	Nos permite guardar una variable en el localStorage

	2. $storage.local.get('key');

	Nos retorna el valor de una variable por su key

	3. $storage.local.remove('key');

	Nos elimina una variable del localStorage por su key

	4. $storage.local.removeAll();

	Nos limpia el localStorage eliminando todas las variables

	5. $storage.bindScope($scope,'key');

	Nos hace un binding de una variable en el localStorage con una variable del mismo
	nombre en el $scope de tal modo que si es modificada en el $scope se modificara
	en el localStorage

* **$storage.session**

> Nos permite acceder al SessionStorage del navegador en caso de que no
este habilitado nos guarda el dato en las cookies

	1. $storage.session.set('key',value);

	Nos permite guardar una variable en el sessionStorage

	2. $storage.session.get('key');

	Nos retorna el valor de una variable por su key

	3. $storage.session.remove('key');

	Nos elimina una variable del sessionStorage por su key

	4. $storage.session.removeAll();

	Nos limpia el sessionStorage eliminando todas las variables

	5. $storage.bindScope($scope,'key');

	Nos hace un binding de una variable en el sessionStorage con una variable del mismo
	nombre en el $scope de tal modo que si es modificada en el $scope se modificara
	en el sessionStorage

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