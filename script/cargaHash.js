var cargado = false;	// Indica si la carga se ha realizado o no
var intervalo = null;	// Intervalo de comprobación de carga
var limite = 1000;		// Limite de veces que comprobara la carga antes de dar error

function mueveRueda(destino){
	
	var rot = 0;
	var aux = destino.split("_");
	if( aux.length == 2 ){		
		rot = aux[0].charAt(0).toLowerCase();
	}else if( aux.length == 3 ){
		rot = aux[1].charAt(0).toLowerCase();
	}else{
		rot = -1;
	}

	var rot2 = 0;
	switch ( rot ){
		case "a": rot2 = 52.3; break;
		case "b": rot2 = 66; break;
		case "c": rot2 = 80; break;
		case "d": rot2 = 93.8; break;
		case "e": rot2 = 108; break;
		case "f": rot2 = 122; break;
		case "g": rot2 = 135.5; break;
		case "h": rot2 = 149; break;
		case "i": rot2 = 163; break;
		case "j": rot2 = 177; break;
		case "k": rot2 = 191; break;
		case "l": rot2 = 205; break;
		case "m": rot2 = 218.3; break;
		case "n": rot2 = 232; break;
		case "o": rot2 = 246; break;
		case "p": rot2 = 260; break;
		case "q": rot2 = 274; break;
		case "r": rot2 = 287.3; break;
		case "s": rot2 = 301; break;
		case "t": rot2 = 315; break;
		case "u": rot2 = 329; break;
		case "v": rot2 = 343; break;
		case "w": rot2 = 357; break;
		case "x": rot2 = 370; break;
		case "y": rot2 = 384; break;
		case "z": rot2 = 398; break;
		default:  rot2 = -1;   break;
	}
	var rot1 = rot2 * 3;
	
	$("#ruedaGrande").css({
		"-webkit-transform": "rotate(-" + rot1 + "deg)",
		"-moz-transform": "rotate(-" + rot1 + "deg)"
	});
	$("#ruedaChica").css({
		"-webkit-transform": "rotate(-" + rot2 + "deg)",
		"-moz-transform": "rotate(-" + rot2+ "deg)"
	});
	
	/**
	 * Muestra el menú de la sección concreta
	 */
	if( (destino == "index")||(rot == -1) )	$(".menuRueda, #canvasRueda").hide("blind",600);
	else $(".menuRueda, #canvasRueda").show("blind",600);
}

/**
 * @brief Función que carga un script desde un fichero y permite ejecutar una función
 * cuando la carga haya terminado.
 * @param url fichero que se quiere cargar
 * @param callback función que se ejecutará cuando la carga termine
 */
function loadScript(url, callback) {
	var script = document.createElement("script")
	script.type = "text/javascript";

	if(script.readyState) {//IE
		script.onreadystatechange = function() {
			if(script.readyState == "loaded" || script.readyState == "complete") {
				script.onreadystatechange = null;
				callback();
			}
		};
	} else {//Others
		script.onload = function() {
			callback();
		};
	}
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}

/**
 * @brief Funcion que carga una página de la web mediante ajax
 * @param destino Destino que se quiere cargar. La estructura del enlace debe
 *  seguir las siguietes pautas:
 * 	- No se admiten barras bajas ("_") en el nombre del fichero (además de cual-
 * 	  quier restricción que de el navegador).
 *  - Los enlaces SIEMPRE deberán ser a archivos locales de la web, si no ajax
 *    no permitirá cargarlos.
 *  - Si se encuentra una barra baja ("_") en la cadena destino, se tomará como
 *    una carpeta, esto quiere decir que por ejemplo con la cadena web_fich se
 *    tratará acceder al fichero fich en la carpeta cap ("cap/fich").
 *  - El fichero destino deberá contener al menos la siguiente sentencia en java-
 *    script: "<script>cargado=true</script>" cuando queramos que se muestre
 *    el contenido. Esta variable está definida como global (no es necesario ni
 * 	  recomendable redefinirla) y nos indicará cuando se ha cargado el fichero
 *    completamente. Así podemos anidarla en una función "load()" y el contenido
 *    solo se mostrará cuando haya cargado completamente.
 */
function clickEnlace(base) {
	// Limpia, por si quedaba un intervalo hecho
	clearInterval(intervalo);
	intervalo = null;
	// Inicializa las variables
	cargado = false;
	limite = 1000;
	
	// Guarda la posicion de la ventana
	var scroll = $(window).scrollTop();

	$("#main").hide("blind", 300, function() {

		// Muestra el mensaje de carga
		$("body").append("<h1 class='cargando'>Cargando...</h1>");
		$(".cargando").position({
			my: "top",
			at: "top",
			of: $(document)
		});

		var destino = ( window.location.hash.substr(1) == "" ) ? "index" : window.location.hash.substr(1);
		
		// Mueve el engranaje de la web
		mueveRueda(destino);
		
		// Reemplaza la barra baja por / para que se puedan usar subcarpetas
		while ( destino.indexOf("_") != -1 )
			destino = destino.replace("_","/");
				
		$("#main").html("").load(base + "" + destino + ".html", '',
		function(responseText, textStatus, XMLHttpRequest) {
			// Comprobamos que se ha cargado correctamente
			if(textStatus == "success") {
				intervalo = setInterval(function() {
					if(cargado) {// Nos aseguramos de que todo este cargado
						// cuando el contenido diga que esta listo.
						// Esta variable se pone a true desde fuera.
						cargado = false;
						clearInterval(intervalo);
						$("#main").show("blind", 600, function() {
							$(window).scrollTop(scroll);
							// Quita la imagen de cargando
							$(".cargando").remove();
						});
					}
					limite--;
					if(limite == 0) {// Si se ha sobrepasado el limite y no hay resultados
						// mostramos un error.
						cargado = false;
						clearInterval(intervalo);
						$("#main").show("blind", 600, function() {
							// Quita la imagen de cargando
							$(".cargando").remove();
						});
					}
				}, 42);
				// Si no ha cargado mostramos el mensaje de error
			} else {
				$("#canvasRueda").hide("blind",300);
				$("#main").html("<h1>Error 404</h1><h2>Página no encontrada</h2><a href='#'>Volver a la página inicial</a>").show("fade", 600, function() {
					// Quita la imagen de cargando
					$(".cargando").remove();
				});
			}
		});
	});
}

$(function() {
	/**
	 * Comprobamos el hash por si tenemos que cargar algo. Esto permite que si
	 * se accede a la web con la url, por ejemplo p2kmgcl.com/#enlace se
	 * accederá automáticamente a la sección #enlace
	 */
	function compruebaHash(){
		if(window.location.hash != "") {
			clickEnlace("web/");
		}else{
			clickEnlace("web/");
		}
	}
	compruebaHash();
	$(window).bind( 'hashchange', compruebaHash );
});
