
class Producto {
    constructor(id, nombre, precio, categoria, imagen) {
      this.id = id;
      this.nombre = nombre;
      this.precio = precio;
      this.categoria = categoria;
      this.imagen = imagen;
    }
  }
  class BaseDeDatos {
    constructor() {
      this.productos = [];
      this.cargarRegistros();
    }

    async cargarRegistros() {
      const resultado = await fetch("./js/productos.json");
      this.productos = await resultado.json();
      cargarProductos(this.productos);
    }

    traerRegistros() {
      return this.productos;
    }
    registroPorId(id) {
      return this.productos.find((producto) => producto.id === id);
    }
    registrosPorNombre(palabra) {
      return this.productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(palabra.toLowerCase())
      );
    }
    registrosPorCategoria(categoria) {
      return this.productos.filter((producto) =>
      producto.categoria == categoria
      );
    }
  }

  class Carrito {
    constructor() {
      const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
      this.carrito = carritoStorage || [];
      this.total = 0; 
      this.cantidadProductos = 0; 
      this.listar();
    }
  
    estaEnCarrito({ id }) {
      return this.carrito.find((producto) => producto.id === id);
    }
    agregar(producto) {
      const productoEnCarrito = this.estaEnCarrito(producto);
      if (!productoEnCarrito) {
        this.carrito.push({ ...producto, cantidad: 1 });
      } else {
        productoEnCarrito.cantidad++;
      }
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      this.listar();
    }
  
    quitar(id) {
      const indice = this.carrito.findIndex((producto) => producto.id === id);
      if (this.carrito[indice].cantidad > 1) {
        this.carrito[indice].cantidad--;
      } else {
        this.carrito.splice(indice, 1);
      }
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      this.listar();
    }
    vaciar(){
      this.total = 0;
      this.cantidadProductos = 0;
      this.carrito = [];
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      this.listar();
    }
    vaciar1(){
      this.total = 0;
      this.cantidadProductos = 0;
      this.carrito = [];
      localStorage.setItem("carrito", JSON.stringify(this.carrito));
      this.listar();
    }
  
    
    listar() {
      this.total = 0;
      this.cantidadProductos = 0;
      divCarrito.innerHTML = "";
      for (const producto of this.carrito) {
        divCarrito.innerHTML += `
          <div class="productoCarrito">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
          </div>
        `;
        this.total += producto.precio * producto.cantidad;
        this.cantidadProductos += producto.cantidad;
      }
      
      if (this.cantidadProductos > 0) {
        botonVaciar.style.display = "block";
        botonComprar.style.display = "block";
      } else {
        botonVaciar.style.display = "none";
        botonComprar.style.display = "none";
      }

      const botonesQuitar = document.querySelectorAll(".btnQuitar");
      for (const boton of botonesQuitar) {
        boton.addEventListener("click", (event) => {
          event.preventDefault();
          const idProducto = Number(boton.dataset.id);
          this.quitar(idProducto);
        });
      }
      spanCantidadProductos.innerText = this.cantidadProductos;
      spanTotalCarrito.innerText = this.total;      
    }
  }
  
  const spanCantidadProductos = document.querySelector("#cantidadProductos");
  const spanTotalCarrito = document.querySelector("#totalCarrito");
  const divProductos = document.querySelector("#productos");
  const divCarrito = document.querySelector("#carrito");
  const inputBuscar = document.querySelector("#inputBuscar");
  const botonCarrito = document.querySelector("section h1");
  const botonComprar = document.querySelector("#botonComprar");
  const botonVaciar = document.querySelector("#botonVaciar");
  const botonesCategorias = document.querySelectorAll(".btnCategoria");

  const bd = new BaseDeDatos();

  const carrito = new Carrito();  

  botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", () => {
      const categoria = boton.dataset.categoria;
      //
      const botonSeleccionado = document.querySelector(".seleccionado");
      botonSeleccionado.classList.remove("seleccionado");
      boton.classList.add("seleccionado");

      if( categoria == "Todos"){
        cargarProductos(bd.traerRegistros());
      } else {
        cargarProductos(bd.registrosPorCategoria(categoria));
      }
    });
  });

  cargarProductos(bd.traerRegistros());
  
  
  function cargarProductos(productos) {
    
    divProductos.innerHTML = "";
    
    for (const producto of productos) {
      divProductos.innerHTML += `
        <div class="producto">
          <h2>${producto.nombre}</h2>
          <p class="precio">$${producto.precio}</p>
          <div class="imagen">
            <img src="img/${producto.imagen}" />
          </div>
          <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar</a>
        </div>
      `;
    }
  
    
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
  
    
    
    for (const boton of botonesAgregar) {
      boton.addEventListener("click", (event) => {
        
        event.preventDefault();
        
        const idProducto = Number(boton.dataset.id);
        
        const producto = bd.registroPorId(idProducto);
        
        carrito.agregar(producto);
        Toastify({
          text: `Has añadido ${producto.nombre} a tu carrito`,
          className: "info",
          gravity: "bottom",
          position: "center",
          style: {
            background: "#4c4c4c",
          }
        }).showToast();
      });
    }
  }
  inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra);
    cargarProductos(productos);
  });
  botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
  });

  botonVaciar.addEventListener("click", (event) => {
  event.preventDefault();
  carrito.vaciar1();
  });

  botonComprar.addEventListener("click", (event) => {
    event.preventDefault();
    Swal.fire({
      position: 'mid',
      icon: 'success',
      title: 'Has realizado tu compra con exito!',
      showConfirmButton: false,
      timer: 1300
    });
    carrito.vaciar();
  });    



