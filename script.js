//   1. BASE DE DATOS Y ESTADO DE LA APLICACION

// Arreglo de objetos con la lista de productos disponibles en el catalogo
const productos = [
    { id: 1, titulo: "Tulipán Eterno", precio: 15000, badge: "NUEVO", tipoBadge: "badge-new", imagenes: ["img/tulipanes.jfif", "img/tulipanes1.jfif"], imgIndex: 0 },
    { id: 2, titulo: "Ramo de Girasoles Eternos", precio: 60000, badge: "MÁS VENDIDO", tipoBadge: "badge-hot", imagenes: ["img/girasoles.jfif", "img/girasoles1.jfif"], imgIndex: 0 },
    { id: 3, titulo: "Lirio Eterno", precio: 60000, badge: "-15%", tipoBadge: "badge-sale", imagenes: ["img/lirio.png", "img/lirio1.png"], imgIndex: 0 },
    { id: 4, titulo: "Margaritas Eternas", precio: 65000, badge: "NUEVO", tipoBadge: "badge-new", imagenes: ["img/margaritas.jfif", "img/margaritas1.jfif"], imgIndex: 0 },
    { id: 5, titulo: "Rosas Eternas", precio: 68000, badge: "POPULAR", tipoBadge: "badge-hot", imagenes: ["img/rosas.jfif", "img/rosas1.jfif"], imgIndex: 0 },
    { id: 6, titulo: "Flor de Arándanos Eterna", precio: 30000, badge: "OFERTA", tipoBadge: "badge-sale", imagenes: ["img/arandanos.jfif", "img/arandanos1.jfif"], imgIndex: 0 },
    { id: 7, titulo: "Eucalipto Eterno", precio: 40000, badge: "MÁS VENDIDO", tipoBadge: "badge-hot", imagenes: ["img/eucalipto.jfif", "img/eucalipto1.jfif"], imgIndex: 0 },
    { id: 8, titulo: "Dalia Eterna", precio: 120000, badge: "NUEVO", tipoBadge: "badge-new", imagenes: ["img/dahlia.jfif", "img/dahlia1.jfif"], imgIndex: 0 },
    { id: 9, titulo: "Flor de Lavanda Eterna", precio: 55000, badge: "LIMITADA", tipoBadge: "badge-hot", imagenes: ["img/lavanda.jfif", "img/lavanda1.jfif"], imgIndex: 0 },
    { id: 10, titulo: "Lirio de Coral Eterno", precio: 65000, badge: "ESPECIAL", tipoBadge: "badge-sale", imagenes: ["img/lirioc.jfif", "img/lirioc1.jfif"], imgIndex: 0 },
    { id: 11, titulo: "Magnolia de Coral Eterna", precio: 65000, badge: "POPULAR", tipoBadge: "badge-hot", imagenes: ["img/magnoliac.jfif", "img/magnoliac1.jfif"], imgIndex: 0 },
    { id: 12, titulo: "Hortensia Eterna", precio: 48000, badge: "OFERTA", tipoBadge: "badge-sale", imagenes: ["img/hortencias1.jfif", "img/hortencias.jfif"], imgIndex: 0 }
];

// Arreglo dinamico para almacenar los productos agregados al carrito
let carrito = [];


//2. REFERENCIAS A ELEMENTOS DEL DOM
const productGrid = document.getElementById('productGrid');

const searchInput = document.getElementById('searchInput');

const searchBtn = document.getElementById('searchBtn');

const cartBtn = document.getElementById('cartBtn');

const cartModal = document.getElementById('cartModal');

const closeModal = document.getElementById('closeModal');

const cartItemsContainer = document.getElementById('cartItems');

const totalPriceElement = document.getElementById('totalPrice');

const cartCount = document.getElementById('cartCount');

const checkoutBtn = document.getElementById('checkoutBtn');

const contactForm = document.getElementById('contactForm');


//3. FUNCIONES AUXILIARES Y MANEJO DE IMAGENES
 /**
 * @param {HTMLImageElement} img - Elemento de imagen que fallo al cargar.
 */
function manejarErrorImagen(img) {

    // Evita un bucle infinito si tambien falla la imagen de reemplazo
    img.onerror = null;

    // Imagen SVG de reemplazo generada directamente desde JavaScript
    img.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='180'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888'%3ECraftBloom%3C/text%3E%3C/svg%3E";
}

/** 
 * @param {number} id - ID del producto.
 * @param {number} direccion - Direccion del carrusel.
 */
function cambiarImagen(id, direccion) {

    // Busca el producto utilizando su ID
    const prod = productos.find(p => p.id === id);

    // Verifica que el producto exista y tenga mas de una imagen
    if (!prod || !prod.imagenes || prod.imagenes.length <= 1) return;

    // Calculo circular del indice para permitir avanzar y retroceder
    prod.imgIndex =
        (prod.imgIndex + direccion + prod.imagenes.length)
        % prod.imagenes.length;

    // Busca la imagen correspondiente dentro del DOM
    const imgElement = document.getElementById(`img-prod-${id}`);

    // Actualiza la imagen mostrada
    if (imgElement) {
        imgElement.src = prod.imagenes[prod.imgIndex];
    }
}


//4. RENDERIZADO DEL CATALOGO DE PRODUCTOS
/** 
* @param {Array} lista - Lista de productos.
*/
function renderizarProductos(lista) {

    // Limpia el catalogo antes de mostrar los productos
    productGrid.innerHTML = '';

    // Si la busqueda no encuentra productos, se muestra un mensaje al usuario
    if (lista.length === 0) {

        productGrid.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                font-size: 1.1rem;
                padding: 30px;
            ">
                No se encontraron productos relacionados con tu búsqueda.
            </p>
        `;

        return;
    }

    // Recorre la lista de productos y crea una tarjeta para cada uno
    lista.forEach(prod => {

        const card = document.createElement('div');

        card.className = 'card';

        card.innerHTML = `

            <span class="badge ${prod.tipoBadge}">
                ${prod.badge}
            </span>

            <div class="carousel-container">

                <button
                    class="slider-btn prev-btn"
                    onclick="cambiarImagen(${prod.id}, -1)"
                    aria-label="Imagen anterior"
                >
                    ❮
                </button>

                <img
                    id="img-prod-${prod.id}"
                    src="${prod.imagenes[prod.imgIndex]}"
                    alt="${prod.titulo}"
                    onerror="manejarErrorImagen(this)"
                >

                <button
                    class="slider-btn next-btn"
                    onclick="cambiarImagen(${prod.id}, 1)"
                    aria-label="Imagen siguiente"
                >
                    ❯
                </button>

            </div>

            <h3>${prod.titulo}</h3>

            <p class="price">
                $${prod.precio.toLocaleString('es-CO')}
            </p>

            <button
                class="btn-primary"
                onclick="agregarAlCarrito(${prod.id})"
            >
                Agregar al Carrito
            </button>

        `;

        // Inserta la tarjeta dentro del catalogo
        productGrid.appendChild(card);
    });
}


//5. BUSQUEDA Y FILTRADO DE PRODUCTOS


function buscarProductos() {

    // Obtiene el texto ingresado por el usuario
    const texto = searchInput.value.toLowerCase().trim();

    // Filtra los productos segun el titulo
    const filtrados = productos.filter(p =>
        p.titulo.toLowerCase().includes(texto)
    );

    // Actualiza el catalogo mostrando unicamente los resultados
    renderizarProductos(filtrados);
}

searchInput.addEventListener('input', buscarProductos);


searchBtn.addEventListener('click', buscarProductos);


//6. LOGICA Y GESTION DEL CARRITO DE COMPRAS
/** 
*@param {number} id - ID de l producto.
*/
function agregarAlCarrito(id) {

    // Busca el producto correspondiente
    const producto = productos.find(p => p.id === id);

    // Verifica que el producto exista antes de agregarlo
    if (!producto) return;

    // Agrega el producto al arreglo del carrito
    carrito.push(producto);

    // Actualiza visualmente el carrito
    actualizarCarrito();
}



function actualizarCarrito() {
    // Actualiza la cantidad total de productos en el encabezado
    cartCount.innerText = carrito.length;

    // Limpia los productos mostrados anteriormente
    cartItemsContainer.innerHTML = '';

    let total = 0;

    // Si el carrito esta sin nada se muestra un mensaje informativo
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `
            <p style="text-align: center; padding: 15px;">
                Tu carrito está vacío.
            </p>
        `;
    }

    // Recorre todos los productos agregados al carrito (Añadimos 'index' para saber cuál borrar)
    carrito.forEach((prod, index) => {
        // Acumula el precio total
        total += prod.precio;

        // Crea un elemento visual para cada producto
        const item = document.createElement('div');

        // Estilos basicos para organizar nombre, precio y botón
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center'; // Centra los elementos verticalmente
        item.style.marginBottom = '10px';
        item.style.borderBottom = '1px solid #eee'; // Línea separadora sutil
        item.style.paddingBottom = '8px';

        // Estructura del item, incluyendo el botón de eliminar
        item.innerHTML = `
            <span style="flex: 1; text-align: left;">${prod.titulo}</span>
            <strong style="margin-right: 15px;">
                $${prod.precio.toLocaleString('es-CO')}
            </strong>
            <button onclick="eliminarDelCarrito(${index})" class="btn-delete" title="Quitar producto">✖</button>
        `;

        // Inserta el producto dentro del modal
        cartItemsContainer.appendChild(item);
    });

    // Muestra el precio total utilizando formato colombiano
    totalPriceElement.innerText = total.toLocaleString('es-CO');
}

// NUEVA FUNCIÓN: Elimina un producto específico usando su posición (index) en el arreglo
function eliminarDelCarrito(index) {
    // splice elimina 1 elemento en la posición indicada ('index')
    carrito.splice(index, 1);
    
    // Volvemos a actualizar la interfaz del carrito
    actualizarCarrito();
}


//   7. CONTROL DEL MODAL DEL CARRITO


cartBtn.addEventListener('click', () => {

    cartModal.style.display = 'flex';

});


closeModal.addEventListener('click', () => {

    cartModal.style.display = 'none';

});


window.addEventListener('click', (e) => {

    if (e.target === cartModal) {

        cartModal.style.display = 'none';

    }

});


// 8. CONFIRMACION DEL PEDIDO

checkoutBtn.addEventListener('click', () => {

    // Verifica si existen productos dentro del carrito
    if (carrito.length === 0) {

        alert('Tu carrito está vacío. Agrega productos antes de confirmar el pedido.');

        return;
    }


    // Muestra un mensaje de confirmacion al usuario
    alert(
        '¡Pedido confirmado con éxito! Gracias por comprar en CraftBloom.'
    );


    // Vacia el carrito despues de confirmar la compra
    carrito = [];


    // Actualiza nuevamente la interfaz
    actualizarCarrito();


    // Cierra el modal del carrito
    cartModal.style.display = 'none';

});


//  9. FORMULARIO DE CONTACTO Controla el envio del formulario de contacto.
 
contactForm.addEventListener('submit', (e) => {

    // Evita que la pagina se recargue al enviar el formulario
    e.preventDefault();


    // Obtiene el valor del primer campo del formulario,
    // correspondiente al nombre del usuario
    const nombre = contactForm.querySelector('input[type="text"]').value;


    // Muestra un mensaje de confirmacion personalizado
    alert(
        `¡Gracias, ${nombre}! Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.`
    );


    // Limpia todos los campos del formulario despues del envio
    contactForm.reset();

});


// 10. INICIALIZACION DE LA PAGINA

document.addEventListener('DOMContentLoaded', () => {

    // Renderiza todos los productos inicialmente
    renderizarProductos(productos);

    // Inicializa el estado visual del carrito
    actualizarCarrito();

});