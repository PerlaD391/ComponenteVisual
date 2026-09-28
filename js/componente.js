const Toast = (function () {

    const contenedores = {};

    let posicionActual = 'top-right';

    const configPorDefecto = {
        duracion: 3000,
        tipo: 'info',
        titulo: '',
        mensaje: '',
        cerrable: true,
        mostrarProgreso: true
    };

    const posicionesValidas = [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right'
    ];

    function obtenerContenedor(posicion) {
        if (posicionesValidas.indexOf(posicion) === -1) {
            posicion = 'top-right';
        }

        if (contenedores[posicion]) {
            return contenedores[posicion];
        }

        const contenedor = document.createElement('div');
        contenedor.className = 'toast-contenedor toast-' + posicion;
        document.body.appendChild(contenedor);

        contenedores[posicion] = contenedor;
        return contenedor;
    }

    function setPosicion(posicion) {
        if (posicionesValidas.indexOf(posicion) !== -1) {
            posicionActual = posicion;
        }
    }

    function getPosicion() {
        return posicionActual;
    }

    function mostrar(opciones) {
        const config = Object.assign({}, configPorDefecto, opciones);

        if (!config.mensaje) {
            console.warn('Toast: se requiere un mensaje');
            return null;
        }

        if (config.posicion) {
            setPosicion(config.posicion);
        }

        const posicionFinal = config.posicion || posicionActual;

        const cont = obtenerContenedor(posicionFinal);

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + config.tipo;

        const iconos = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <div class="toast-icono">${iconos[config.tipo] || iconos.info}</div>
            <div class="toast-contenido">
                ${config.titulo ? `<div class="toast-titulo">${config.titulo}</div>` : ''}
                <div class="toast-mensaje">${config.mensaje}</div>
            </div>
            ${config.cerrable ? '<button class="toast-cerrar" aria-label="Cerrar">✕</button>' : ''}
            ${config.mostrarProgreso ? '<div class="toast-progreso"></div>' : ''}
        `;

        cont.appendChild(toast);

        void toast.offsetWidth;
        toast.classList.add('toast-visible');

        if (config.cerrable) {
            const btnCerrar = toast.querySelector('.toast-cerrar');
            btnCerrar.addEventListener('click', function () {
                cerrar(toast);
            });
        }

        if (config.duracion > 0) {
            if (config.mostrarProgreso) {
                const progreso = toast.querySelector('.toast-progreso');
                progreso.style.transition = 'width ' + config.duracion + 'ms linear';
                void progreso.offsetWidth;
                progreso.style.width = '0%';
            }

            setTimeout(function () {
                cerrar(toast);
            }, config.duracion);
        }

        return toast;
    }

    function cerrar(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('toast-visible');
        toast.classList.add('toast-saliendo');

        setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    function cerrarTodos() {
        const toasts = document.querySelectorAll('.toast');
        toasts.forEach(function (toast) {
            cerrar(toast);
        });
    }

    function exito(mensaje, opciones) {
        return mostrar(Object.assign({ tipo: 'success', mensaje: mensaje }, opciones || {}));
    }

    function error(mensaje, opciones) {
        return mostrar(Object.assign({ tipo: 'error', mensaje: mensaje }, opciones || {}));
    }

    function advertencia(mensaje, opciones) {
        return mostrar(Object.assign({ tipo: 'warning', mensaje: mensaje }, opciones || {}));
    }

    function info(mensaje, opciones) {
        return mostrar(Object.assign({ tipo: 'info', mensaje: mensaje }, opciones || {}));
    }

    return {
        mostrar: mostrar,
        cerrar: cerrar,
        cerrarTodos: cerrarTodos,
        setPosicion: setPosicion,
        getPosicion: getPosicion,
        exito: exito,
        error: error,
        advertencia: advertencia,
        info: info
    };

})();