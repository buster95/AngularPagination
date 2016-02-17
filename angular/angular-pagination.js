
var app = angular.module('ngPagination', []).



filter('startFrom', function() {
    return function(input, inicio) {
        inicio = +inicio;
        return input.slice(inicio);
    }
}).





service('$register', function($injector){
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

	return function() {
		return $injector.instantiate(registerMetodos);
	};
}).












directive('ngPagination', function($compile, $parse, $register){
	var registro;

	var createID = function (scope, id) {
		registro = new $register();
		registro.set(id);
		$parse(registro.get()).assign(scope, {pageCurrent:0, pageSize: 5, pages: 1, nextPage: function(){}, beforePage: function(){}});
	}

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
		priority: 10,
	    restrict: 'A',
		scope: false,
		compile: function(tElement, tAttrs) {
			// COMPILE RETURNED LINKED
			return function(scope, element, attr){
				var atributo = element.attr('ng-pagination');
				var varName = getVarname(element.attr('ng-pagination'));
				createID(scope, varName);

				// ADD ng-repeat Y QUITANDO EL ng-pagination PARA EVITAR LOOP
				element.attr('ng-pagination', atributo + " | startFrom:"+
					registro.getCurrentNotation()+"*"+registro.getSizeNotation()+
					" | limitTo:"+registro.getSizeNotation());
				element.attr('ng-repeat', element.attr('ng-pagination'));
				element.removeAttr('ng-pagination');

				// NOMBRE DE LA VARIABLE DE LOS DATOS
				var datos = $parse(varName)(scope);

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

				$compile(element)(scope);
			}
		}
	};
}).






directive('ngPaginationControl', function($parse, $compile, $register){
	// VARIABLES PARA CREAR ESTILO
	var fondo='#337AB7';
	var fondoHover='#286090';
	var color='white';
	var alto= '30px';
	var borderRadius='6px';

	function CreateStyle() {
		var estilo = '<style>'+
		'.pagination-panel{'+
			'position: relative;'+
			'display: inline-block;'+
			'background-color: '+fondo+';'+
			'border: 1px solid #2e6da4;'+
			'height: '+alto+';'+
			'border-radius: '+borderRadius+';'+
		'}'+
		'.pagination-panel .indicator{'+
			'color: '+color+';'+
			'font-weight: bold;'+
			'font-size: 15px;'+
			'padding: 0px 8px;'+
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
			'background-color: orange;'+
			'cursor: not-allowed;'+
		'}'+
		'</style>';
		angular.element(document.head).append(estilo);
	}

	return {
		priority: 5,
		restrict: 'E',
		replace: true,
		scope: false,




		compile: function (element, attrs) {
			var registro = new $register;
			if(element.attr('ng-pagination-id')==undefined
				|| element.attr('ng-pagination-id')==''){
				throw "directiva ng-pagination-control requiere atributo ng-pagination-id\n";
			}else{
				registro.set(element.attr('ng-pagination-id'));
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
});