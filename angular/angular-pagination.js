angular.module('ngPagination', []).

filter('startFrom', function() {
    return function(input, inicio) {
        inicio = +inicio;
        return input.slice(inicio);
    }
}).





// SERIVICIO PARA REGISTRAR LAS VARIABLES QUE AYUDAN A PAGINAR
service('$paginationRegister', function($injector){
	function registerMetodos () {
		this.page_id = '';
		this.variable = '';
	}
	registerMetodos.prototype.set = function (id) {
		this.page_id = 'pag_'+id;
		this.variable = id;
	}
	registerMetodos.prototype.get = function () {
		return this.page_id;
	}
	registerMetodos.prototype.getDataNotation = function () {
		return this.variable;
	}
	registerMetodos.prototype.getSizeNotation = function () {
		return this.page_id + '.pageSize';
	}
	registerMetodos.prototype.getPagesNotation = function () {
		return this.page_id + '.pages';
	}
	registerMetodos.prototype.getCurrentNotation = function () {
		return this.page_id + '.pageCurrent';
	}

	registerMetodos.prototype.getNextNotation = function () {
		return this.page_id + '.nextPage';
	}
	registerMetodos.prototype.getBeforeNotation = function () {
		return this.page_id + '.beforePage';
	}
	registerMetodos.prototype.getSearchNotation = function () {
		return 'txt_search_'+this.variable;
	}

	return function() {
		return $injector.instantiate(registerMetodos);
	};
}).






directive('ngPagination', function($compile, $parse, $paginationRegister){
	var getVarname = function (RepeatValue) {
		var variable = RepeatValue.replace(' in ','~');
		variable = variable.replace(' | ','~');
		variable = variable.replace('|','~');
		variable = variable.split('~');
		return variable[1].replace(' ','');
	}

	var getPaginas = function (datos, size){
		var pag = Math.ceil(datos.length/size);
        return pag;
    }

	return {
		priority: 15,
	    restrict: 'A',
		scope: false,
		compile: function(tElement, tAttrs) {
			// COMPILE RETURNED LINKED
			return function(scope, element, attr){
				var atributo = element.attr('ng-pagination');
				var dataNotation = getVarname(element.attr('ng-pagination'));

				var registro = new $paginationRegister();
				registro.set(dataNotation);
				$parse(registro.get()).assign(scope, {pageCurrent:0, pageSize: 5, pages: 1, nextPage: function(){}, beforePage: function(){}});

				// ADD ng-repeat Y QUITANDO EL ng-pagination PARA EVITAR LOOP
				element.attr('ng-pagination', atributo + " | startFrom:"+
					registro.getCurrentNotation()+"*"+registro.getSizeNotation()+
					" | limitTo:"+registro.getSizeNotation());
				element.attr('ng-repeat', element.attr('ng-pagination'));
				element.removeAttr('ng-pagination');

				// DATOS OBTENIDOS POR EL NOMBRE DE VARIABLE
				var datos = $parse(dataNotation)(scope);

				// NUMERO DE DATOS POR PAGINA
				var size = Number(element.attr('ng-pagination-size')) + 0;
				if(angular.isDefined(element.attr('ng-pagination-size')) && angular.isNumber(size) && size > -1){
					$parse(registro.getSizeNotation()).assign(scope, Number(size));
				}

				// NUMERO DE PAGINAS
				var paginas = getPaginas(datos, $parse(registro.getSizeNotation())(scope));
				if(paginas!=undefined && paginas!=''){
					$parse(registro.getPagesNotation()).assign(scope, Number(paginas));
				}

				scope.$watch(dataNotation, function () {
					var dataNot = registro.getDataNotation();
					var sizeNot = registro.getSizeNotation();
					var paginas = getPaginas($parse(dataNot)(scope), $parse(sizeNot)(scope));
					if(paginas!=undefined && paginas!=''){
						$parse(registro.getPagesNotation()).assign(scope, Number(paginas));
					}
				});

				$compile(element)(scope);
			}
		}
	};
}).






directive('ngPaginationControl', function($parse, $compile, $paginationRegister){
	// VARIABLES PARA CREAR ESTILO
	var fondo='#337AB7';
	var fondoHover='#286090';
	var color='white';
	var alto= '40px';
	var borderRadius='6px';

	function CreateStyle() {
		var estilo = '<style>'+
		'.pagination-panel{'+
			'position: relative;'+
			'display: inline-block;'+
			'background-color: '+fondo+';'+
			'border: 1px solid #2e6da4;'+
			'--height: '+alto+';'+
			'border-radius: '+borderRadius+';'+
		'}'+
		'.pagination-panel .indicator{'+
			'color: '+color+';'+
			'font-weight: bold;'+
			'font-size: 15px;'+
			'padding: 0px 8px;'+
			'line-height: 0;'+
		'}'+
		'.pagination-panel button{'+
			'background-color: '+fondo+';'+
			'color: '+color+';'+
			'//padding: 10px 5px;'+
			'height: '+alto+';'+
			'border: none;'+
			'cursor: pointer;'+
		'}'+
		'.pagination-panel button:hover{'+
			'background-color: '+fondoHover+';'+
		'}'+
		'.pagination-panel button:first-child{'+
			'border-radius: '+borderRadius+' 0px 0px '+borderRadius+';'+
			'border-right: none;'+
		'}'+
		'.pagination-panel button:last-child{'+
			'border-radius: 0px '+borderRadius+' '+borderRadius+' 0px;'+
			'border-left: none;'+
		'}'+
		'.pagination-panel button[disabled]{'+
			'color: #E9F1F5;'+
			'background-color: #D1D5D8;'+
			'cursor: not-allowed;'+
		'}'+
		'</style>';
		angular.element(document.head).append(estilo);
	}

	return {
		priority: 10,
		restrict: 'E',
		scope: false,

		compile: function (element, attrs) {
			var registro = new $paginationRegister;
			if(element.attr('pagination-id')==undefined
				|| element.attr('pagination-id')==''){
				throw "directiva NG-PAGINATION-CONTROL requiere atributo pagination-id\n";
			}else{
				registro.set(element.attr('pagination-id'));
			}

			if(element.attr('background')!=undefined && element.attr('background')!=''){
				fondo = element.attr('background');
			}
			if(element.attr('background-hover')!=undefined && element.attr('background-hover')!=''){
				fondoHover = element.attr('background-hover');
			}
			if(element.attr('color')!=undefined && element.attr('color')!=''){
				color = element.attr('color');
			}
			if(element.attr('height')!=undefined && element.attr('height')!=''){
				alto = element.attr('height');
			}
			CreateStyle();

			// COMPILE RETURNED LINKED
			return function (scope, element, atributos) {
				var controls = angular.element('<div class="pagination-panel">'+
					'<button ng-click="'+registro.getBeforeNotation()+'()" type="button"'+
					'ng-disabled="'+registro.getCurrentNotation()+'<=0">Anterior</button>'+

					'<small class="indicator">{{'+registro.getCurrentNotation()+'+1}}/{{'+registro.getPagesNotation()+'}}</small>'+

					'<button ng-click="'+registro.getNextNotation()+'()" type="button"'+
					'ng-disabled="'+registro.getCurrentNotation()+'>=('+registro.getDataNotation()+'.length/'+registro.getSizeNotation()+')-1">Siguiente</button>'+
				'</div>');

				$parse(registro.getBeforeNotation()).assign(scope, function () {
					var actual = $parse(registro.getCurrentNotation())(scope);
					actual = actual-1;
					$parse(registro.getCurrentNotation()).assign(scope, actual);
				});

				$parse(registro.getNextNotation()).assign(scope, function () {
					var actual = $parse(registro.getCurrentNotation())(scope);
					actual = actual+1;
					$parse(registro.getCurrentNotation()).assign(scope, actual);
				});

				$compile(controls)(scope);
				element.replaceWith(controls);
			}
		}
	};
}).






directive('ngPaginationSearch', function($compile, $parse, $paginationRegister){
	function filtrar(datos, filtro) {
		var busqueda=[];
		angular.forEach(datos, function(fila) {
			for(key in fila){
				var propiedad = fila[key];
				if (CompararFn(fila[key], filtro)) {
    				busqueda.push(fila);
    				return;
				}
			}
		});
		return busqueda;
    }

    function CompararFn(value1, value2) {
    	if(angular.isString(value1)){
    		value1 = value1.toLowerCase();
    	}
   		if (angular.isString(value2)) {
    		value2 = value2.toLowerCase();
    	}

    	if (angular.isString(value1) && angular.isString(value2)) {
    		if (value1.indexOf(value2)>-1) {
    			return true;
    		}
    	}
    	if(angular.isNumber(value1) && angular.isNumber(value2)){
    		if(value1==value2){
    			return true;
    		}
    	}

    	if (angular.isString(value1) && angular.isNumber(value2)) {
    		if(value1.indexOf(value2)>-1){
    			return true;
    		}
    	}

    	return false;
    }

	return {
		priority: 5,
		scope: false,
		restrict: 'E',

		compile: function(iElement, attrs){
			var registro = new $paginationRegister();
			if(iElement.attr('pagination-id')==undefined
				|| iElement.attr('pagination-id')==''){
				throw "directiva NG-PAGINATION-SEARCH requiere atributo pagination-id\n";
			}else{
				registro.set(iElement.attr('pagination-id'));
			}

			// COMPILE RETURNED LINKED
			return function (scope, element, atributos){
				var dataNotation = registro.getDataNotation();
				var data = $parse(dataNotation)(scope);

				var tempDataNotation = registro.getDataNotation()+'_tmp';
				var tempData = $parse(tempDataNotation).assign(scope, data);


				// VARIABLES PARA GENERAR ESTILO
				var clases;
				var id_element;
				var value;
				var name;
				var placeholder;
				var modelo = registro.getSearchNotation();
				var input = angular.element('<input ng-model="'+modelo+'">');

				if(element.attr('class')!=undefined && element.attr('class')!=''){
					clases = element.attr('class');
					input.attr('class',clases);
				}
				if(element.attr('id')!=undefined && element.attr('id')!=''){
					id_element = element.attr('id');
					input.attr('class',clases);
				}
				if(element.attr('value')!=undefined && element.attr('value')!=''){
					value = element.attr('value');
					$parse(modelo).assign(scope, value);
					input.attr('value', value);
				}
				if(element.attr('placeholder')!=undefined && element.attr('placeholder')!=''){
					placeholder = element.attr('placeholder');
					input.attr('placeholder', placeholder);
				}

				// EVENTO WATCH PARA EL CAMBIO DEL INPUT EN BUSQUEDA
				scope.$watch(modelo, function () {
					// CAPTURANDO EL VALOR DEL INPUT
					var filtro = $parse(modelo)(scope);
					// AL MOMENTO DE BUSQUEDA MANDAR EL CURRENT PAGE A 0 PARA QUE SE VAYA A LA PRIMERA PAGINA
					$parse(registro.getCurrentNotation()).assign(scope, 0);
					if(filtro==undefined || filtro==''){
						$parse(dataNotation).assign(scope, tempData);
					}else{
						var resultado = filtrar(tempData, filtro);
						$parse(dataNotation).assign(scope, resultado);
					}
				});

				$compile(input)(scope);
				element.replaceWith(input);
			}
		}
	};
});