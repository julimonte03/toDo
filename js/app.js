const fecha = document.querySelector("#fecha");
const nombre = document.getElementById("nombreDiv");
const botonAgregar = document.getElementById("botonAgregar");
const input = document.getElementById("input");
const lista = document.getElementById("lista");
const texto = document.getElementById("texto");
let tareas = []; 

let nombreUsuario;
let numeroTelefono;

document.addEventListener("DOMContentLoaded", () => {
  traerTareaStorage();
  borrarTodo();
  if (tareas.length === 0 && !nombreUsuario) {
    Swal.fire({
      title: "Quiero recibir notificaciones cuando agrego una tarea nueva.",
      html:
        '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
        '<input id="telefono" class="swal2-input" placeholder="Número de teléfono">',
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#ff0000",
      preConfirm: () => {
        const nombre = document.getElementById(`nombre`).value;
        const telefono = document.getElementById(`telefono`).value;
        if (nombre === "") {
          Swal.showValidationMessage("Por favor, ingresa tu nombre.");
        } else if (telefono === "" || isNaN(telefono)) {
          Swal.showValidationMessage("Por favor, ingresa un número de teléfono válido.");
        } else {
          nombreUsuario = nombre
          numeroTelefono = telefono
        }
      },
      allowOutsideClick: () => !Swal.isLoading(), 
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarNombre();
        actualizarStorage();
      }
    });
  }else if(tareas.length === 0 && nombreUsuario){
    Swal.fire({
      title: "Quiero recibir notificaciones cuando agrego una tarea nueva.",
      html: '<input id="telefono" class="swal2-input" placeholder="Número de teléfono">',
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#ff0000",
      preConfirm: () => {
        const telefono = document.getElementById(`telefono`).value;
        if (telefono === "" || isNaN(telefono)) {
          Swal.showValidationMessage("Por favor, ingresa un número de teléfono válido.");
        } else {
          numeroTelefono = telefono
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarStorage();
      }
    });    
  }
});

function cambiarNombre() {
  const h1 = document.getElementById("h1");
  if (nombreUsuario !== "") {
    h1.innerHTML = `Hola ${nombreUsuario}!`;
  }
}

const FECHA = new Date();
fecha.innerHTML = FECHA.toLocaleDateString("es-AR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function agregarTarea(tarea) {
  let tareaNueva = { tarea: tarea, realizado: false };
  tareas.push(tareaNueva);
  input.value = "";
  actualizarListaTareas();
  actualizarStorage();
  borrarTodo();
}

botonAgregar.addEventListener("click", () => {
  let tareaNueva = input.value.trim();
  if (tareaNueva) {
    agregarTarea(tareaNueva);
  }
});

input.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    let tareaNueva = input.value.trim();
    if (tareaNueva) {
      agregarTarea(tareaNueva);
    }
  }
});

function actualizarListaTareas() {
  lista.innerHTML = "";
  if (tareas.length === 0) {
    texto.innerHTML = "No hay tareas pendientes...";
  } else {
    texto.innerHTML = "Estas son tus tareas:";
  }
  tareas.forEach((tarea, index) => {
    const nuevoItem = document.createElement("li");
    nuevoItem.innerHTML = `<i class="bi bi-check-circle" id="realizado-${index}"></i>
        <p class="text">${tarea.tarea}</p>
        <i class="bi bi-trash" id="eliminado-${index}"></i>`;
    lista.appendChild(nuevoItem);

    const botonRealizado = document.getElementById(`realizado-${index}`);
    botonRealizado.addEventListener("click", () => {
      if (tarea.realizado) {
        tarea.realizado = false;
        nuevoItem.querySelector(".text").classList.remove("line-through");
      } else {
        tarea.realizado = true;
        nuevoItem.querySelector(".text").classList.add("line-through");
      }
    });

    const botonEliminar = document.getElementById(`eliminado-${index}`);
    botonEliminar.addEventListener(`click`, () => {
      tareas.splice(index, 1);
      nuevoItem.remove();
      actualizarListaTareas();
      actualizarStorage();
      borrarTodo();
    });
  });
}

function actualizarStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  localStorage.setItem("nombre",JSON.stringify(nombreUsuario));
  localStorage.setItem("numero",JSON.stringify(numeroTelefono));
}

function traerTareaStorage() {
  const tareasStorage = JSON.parse(localStorage.getItem("tareas"));
  const nombreStorage = JSON.parse(localStorage.getItem("nombre"));
  const numeroStorage = JSON.parse(localStorage.getItem("numero"));
  if (tareasStorage && nombreStorage && numeroStorage) {
    tareas = tareasStorage;
    nombreUsuario = nombreStorage;
    numeroTelefono = numeroStorage;
    actualizarListaTareas();
    cambiarNombre();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sortable = new Sortable(lista, {
      animation: 350,
  });
});

function borrarTodo() {
  const seccionTareas = document.querySelector(".seccion-tareas");
  const botonBorrarTodo = document.getElementById("borrarTodo");

  if (tareas.length >= 2) {
    if (!botonBorrarTodo) {
      const boton = document.createElement("button");
      boton.innerHTML = `<i class="bi bi-trash2" id="borrarTodo">Borrar todo</i>`;
      boton.addEventListener("click",() =>{
        eliminarTodasLasTareas()})
      seccionTareas.insertBefore(boton, seccionTareas.firstChild);
    }
  } else {
    if (botonBorrarTodo) {
      botonBorrarTodo.parentNode.parentNode.removeChild(botonBorrarTodo.parentNode);
    }
  }
}

async function eliminarTodasLasTareas() {
  const confirmacion = await Swal.fire({
    title: "¿Estás seguro de que queres borrar todas las tareas?",
    text: "¡No hay vuelta atrás!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#008000",
    cancelButtonColor: "#ff0000",
    confirmButtonText: "Sí, borrar todo."
  });
  if (confirmacion.isConfirmed) {
    Swal.fire({
      title: "¡Tareas borradas con éxito!",
      icon: "success",
      confirmButtonColor:"#808080",
    });
    tareas = []; 
    actualizarListaTareas(); 
    actualizarStorage(); 
    borrarTodo(); 
  }
}

fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if(response.ok){
        return response.json();
      }})
      .then(usuarios => {
        if (!encontrarUsuario(nombreUsuario,numeroTelefono,usuarios)){
          const nuevoUsuario = {nombre:nombreUsuario,numero:numeroTelefono}
          console.log(nuevoUsuario);
          usuarios.push(nuevoUsuario);
          console.log(usuarios);
        }
      })

function encontrarUsuario(nombre,numero,lista){
  if (lista.some(usuario => nombre === usuario.nombre && numero === usuario.numero)){
    return true
  }else{
    return false
  }
}