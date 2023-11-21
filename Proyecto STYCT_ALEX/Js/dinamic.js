document.addEventListener('DOMContentLoaded', function() {
    // **Configuración del Video de Fondo**

    // Obtener el contenedor del video por su ID
    var videoContainer = document.getElementById('video-container');

    // ID del video de YouTube
    var videoID = 'IbGOogrI898';

    // Crear un iframe para insertar el video
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&loop=1&controls=0&vq=hd2160`);
    iframe.setAttribute('allow', 'autoplay; encrypted-media');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = '120%'; // Ancho al 100%
    iframe.style.height = '120%'; // Altura al 100%
    iframe.style.position = 'fixed';
    iframe.style.top = '-10%';
    iframe.style.left = '-10%';
    iframe.style.right = '-10%';
    iframe.style.bottom = '-10%';
    iframe.style.opacity = '0.5';
    iframe.style.zIndex = '-1';

    // Cambiar el color de fondo del contenedor del video a negro
    videoContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Fondo negro oscuro

    // Agregar el iframe al contenedor del video
    videoContainer.appendChild(iframe);


    // **Manejo de Secciones y Menú de Navegación**

    // Seleccionar todas las secciones
    var secciones = document.querySelectorAll('section');

    // Seleccionar todos los ítems del menú
    var menuItems = document.querySelectorAll('.ui.inverted.menu.grey.fixed a');

    // Ocultar todas las secciones excepto la primera al cargar la página
    secciones.forEach(function(seccion, index) {
        if (index !== 0) {
            seccion.style.display = 'none';
        }
    });

    // Manejador de clics en los ítems del menú
    menuItems.forEach(function(item, index) {
        item.addEventListener('click', function(event) {
            // Prevenir el comportamiento predeterminado del enlace
            event.preventDefault();

            // Ocultar todas las secciones
            secciones.forEach(function(seccion) {
                seccion.style.display = 'none';
            });

            // Mostrar la sección correspondiente al ítem del menú seleccionado
            secciones[index].style.display = 'block';
        });
    });

    // **Obtener Datos Meteorológicos usando la API de OpenWeatherMap**

    // Clave de API de OpenWeatherMap
    const apiKey = '8d73577620cf26b69ae980401f9d88bf';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Pereira&units=metric&lang=es&appid=${apiKey}`;

    // Función para obtener datos de la API del clima
    function getWeather() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Manipular los datos según sea necesario
                const weatherInfo = `
                    <p>Ciudad: ${data.name}</p>
                    <p>Temperatura: ${Math.round(data.main.temp)} °C</p>
                    <p>Condición: ${capitalizeFirstLetter(data.weather[0].description)}</p>
                    <i class="${getWeatherIconClass(data.weather[0].icon)}"></i>
                `;
                document.getElementById('weather-info').innerHTML = weatherInfo;
            })
            .catch(error => console.error('Error al obtener datos:', error));
    }

    // Función para obtener la clase del icono del clima de Semantic UI
    function getWeatherIconClass(iconCode) {
        // Mapear los códigos de iconos de OpenWeatherMap a los de Semantic UI
        const iconMap = {
            '01d': 'sun',
            '01n': 'moon',
            '02d': 'cloud sun',
            '02n': 'cloud moon',
            '03d': 'cloud',
            '03n': 'cloud',
            '04d': 'cloud',
            '04n': 'cloud',
            '09d': 'showers',
            '09n': 'showers',
            '10d': 'rain',
            '10n': 'rain',
            '11d': 'bolt',
            '11n': 'bolt',
            '13d': 'snowflake',
            '13n': 'snowflake',
            '50d': 'fog',
            '50n': 'fog',
        };

        // Agregar la clase 'icon' al nombre del icono
        const iconName = iconMap[iconCode] || 'question';
        return `icon ${iconName}`;
    }

    // Función para capitalizar la primera letra de una cadena
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Llamar a la función al cargar la página
    getWeather();
});
$(document).ready(function() {
            // Evento clic en "Más información"
            $('.more-info-link').on('click', function(e) {
                e.preventDefault();

                // Obtener el ID de la tarjeta específica
                var cardId = $(this).data('id');
                var linkUrl = 'https://es.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro=true&titles=' + cardId + '&pithumbsize=500&origin=*';

                $.ajax({
                    url: linkUrl,
                    method: 'GET',
                    dataType: 'jsonp',
                    success: function(data) {
                        var pages = data.query.pages;
                        var pageId = Object.keys(pages)[0];
                        var extract = pages[pageId].extract;
                        var imageUrl = pages[pageId].thumbnail ? pages[pageId].thumbnail.source : null;

                        showOverlay(extract, imageUrl);
                    },
                    error: function() {
                        console.log('Error al obtener la información desde Wikipedia.');
                    }
                });
            });

            function showOverlay(info, imageUrl) {
                var modalHtml = `
                <div class="ui modal rounded transparent" style="max-width: 100% !important; overflow-y: auto;">
                    <i class="close icon"></i>
                    <div class="header">Información Adicional</div>
                    <div class="content" > <!-- Reducir el margin-bottom a 20px o ajustar según sea necesario -->
                        ${imageUrl ? `<img src="${imageUrl}" alt="Imagen de Wikipedia" style="max-width: 40%; max-height: 200px; float: left; margin-right: 15px;">` : ''}
                        <p>${info}</p>
                    </div>
                    <div class="actions">
                        <div class="ui button cerrar-modal">Cerrar</div>
                    </div>
                </div>
            `;
            
                $('body').append(modalHtml);
            
                // Aplicar los estilos y mostrar el modal
                $('.ui.modal')
                    .modal({
                        blurring: true,
                        onShow: function () {
                            // Ajustar el margen derecho para evitar el desplazamiento
                            $('body').css('margin-right', getScrollBarWidth() + 'px');
                        },
                        onHidden: function () {
                            // Restaurar el margen derecho al estado normal
                            $('body').css('margin-right', 0);
                            $('.ui.modal').remove();
                            $(document).off('click');
                        }
                    })
                    .modal('show')
                    .find('.content img')
                    .css('max-width', '30%') // Ajuste del ancho máximo de la imagen
                    .css('max-height', '30%'); // Ajuste de la altura máxima de la imagen
            
                // Manejar clic en el botón "Cerrar"
                $('.cerrar-modal').on('click', function () {
                    $('.ui.modal').modal('hide');
                });
            }
            

    // Función para obtener el ancho de la barra de desplazamiento
    function getScrollBarWidth() {
        var inner = document.createElement('p');
        inner.style.width = '100%';
        inner.style.height = '200px';

        var outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '0';
        outer.style.left = '0';
        outer.style.visibility = 'hidden';
        outer.style.width = '200px';
        outer.style.height = '150px';
        outer.style.overflow = 'hidden';
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 === w2) w2 = outer.clientWidth;

        document.body.removeChild(outer);

        return w1 - w2;
    }
});