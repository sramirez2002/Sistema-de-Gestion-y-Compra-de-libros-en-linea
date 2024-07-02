<template>
  <div class="product-card card" style="width: auto; height: min-content;" >
    <div class="card-body product-details">
      <div class="row">
        <div>
          <h5 @click="EntrarEnLibro" class="card-title product-title" style="text-align: left;">{{ libro.Titulo }}</h5>
          <p class="card-text" style="text-align: left;">Autor: {{ libro.Autor }}</p>
          <!-- /* convierte el numero a moneda */ -->
          <div class="row">
            <div class="col-12 col-md-4 ">
              <p class="card-text">Unidades: <strong>{{ libro.Cantidad }}</strong></p>
            </div>
            <div class="col-12 col-md-4">
              <p class="card-text product-price" style="text-align: left;">{{ Precio }}</p>
            </div>
            <div class="col-12 col-md-4 ">
              <button @click="removeBook()" class="btn delete-button">
                    <span class="material-symbols-outlined delete-icon">
                      delete
                    </span>
                  </button>
            </div>
          </div>
        </div>
      </div>
      <button v-if="Admin" @click="Editar" class="btn btn-primary">Editar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    libro: Object, // Recibe el objeto del libro como propiedad
    backendUrl : String
  },
  data() {
    return {
      Precio: "",
      Genero: "",
      Admin: false,
    };
  },
  created() {
    this.Formatear();
    this.isAdmin();
  },
  methods: {
    async removeBook() {
      // Elimina el libro del carrito
      if (!this.backendUrl) {
        this.loading = false; 
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }
      
      this.loading = true;
      
      // espera 3 segundos
      
      let Auxiliar = JSON.parse(localStorage.UserData);
      Auxiliar.Carrito = Auxiliar.Carrito.filter((book) => book.ISSN !== this.libro.ISSN);

      const headers = {
      'Action': 'UpdateCar'
      };
      try {
        const response = await axios.post(this.backendUrl, Auxiliar, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          localStorage.UserData = JSON.stringify(response.data.Data);     
          // reload the page
          this.$router.go();     
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error al intentar añadir al carrito: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        // Aquí podrías manejar errores específicos de la petición
        alert("Error al conectarse. Por favor, inténtalo de nuevo.");
      }

    },
      
    EntrarEnLibro() {
      this.$router.push({ name: 'Book', params: { id: this.libro.ISSN } });
    },
    Formatear() {
      // Formatea el precio a moneda
      this.Precio = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(this.libro.Precio);
      //Formatea el genero para estar en mayuscula la primera letra
      this.Genero = this.libro.Genero.charAt(0).toUpperCase() + this.libro.Genero.slice(1);
    },
    Editar() {
      // envía a la vista de edición '/edit-book'
      this.$router.push({ name: 'edit-book', params: { Libro: this.libro } });
    },
    isAdmin() {
      // Verifica si el usuario es administrador
      if (localStorage.UserData !== undefined) {
        if (JSON.parse(localStorage.UserData).Tipo === "Admin") {
          this.Admin = true;
        }
      }
      if (JSON.parse(localStorage.UserData).Tipo === "Admin") {
        this.Admin = true;
      }
    },
  }
};
</script>

<style scoped>
.product-title {
  font-size: 27px;
  font-weight: bold;
}

.product-title:hover {
  color: green;
  cursor: pointer;
}

.product-card {
  margin-bottom: 20px;
  /* borde */
  border-color: #4c0000;

}

.product-details {
  display: flex;
  flex-direction: column;
  font-size: 20px;
}

.product-price {
  color: green;
  font-size: 24px;
  text-align: right;
  font-weight: bold;
}

.card-text {
  text-align: left;
}

.card {
  border-color: #4c0000;
  margin-bottom: 1%;
  margin-left: 5%;
  margin-right: 5%;
}


.delete-button {
  background-color: #ffffff;
  /* Color de fondo del botón */
  border-color: #230007;
  /* Color del borde del botón */
  color: #ffffff;
  /* Color del texto */
  /* Ajusta el tamaño del mazximo */
  width: 100%;
  
}

.delete-button:hover {
  background-color: #ff4f4f;
  /* Color de fondo del botón */
  border-color: #ffffff;
  /* Color del borde del botón */
  color: #ffffff;
  /* Cambia el color de delete icon */
}

.delete-button:hover .delete-icon {
  color: #ffffff;
  /* Cambia el color del icono al pasar el cursor */
}

.delete-icon {
  color: #230007;
  /* Color del icono */
}
</style>
