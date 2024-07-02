<template>
  <div class="product-card card" style="width: auto; height: min-content;" @click="EntrarEnLibro">
    <div class="card-body product-details">
        <div class="row">   
          <div class="col-12 col-md-6 mb-3">
            <img :src="require('@/assets/book.png')" alt="logo" width="50%">
          </div>
          <div class="col-12 col-md-6 mb-3">
            <h5 class="card-title product-title" style="text-align: left;">{{ libro.Titulo }}</h5>
            <!-- /* convierte el numero a moneda */ -->
            <p class="card-text product-price" style="text-align: left;">COP {{ Precio }}</p>
            
            <p class="card-text" style="text-align: left;">Autor: {{ libro.Autor }}</p>
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <p class="card-text">Estado: {{ libro.Estado }}</p>
              </div>

              <div class="col-12 col-md-6 mb-3">
                <p class="card-text">Género: {{ Genero }}</p>
              </div>
              
              <div class="col-12 col-md-6 mb-3">
                <p class="card-text">Idioma: {{ libro.listaIdiomas }}</p>
              </div>
              
              <div class="col-12 col-md-6 mb-3">
                <p class="card-text">Copias: {{ libro.Existencias }}</p>
              </div>
            </div>
          </div>
        </div>
      <button v-if="Admin" @click="Editar" class="btn btn-primary">Editar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    libro: Object, // Recibe el objeto del libro como propiedad
    Data: Object
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
.product-title{
  font-size: 27px;
  font-weight: bold;
}
.product-card {
  margin-bottom: 20px;
  /* borde */
  border-color: #4c0000;

}
.product-card:hover {
  background-color: rgb(229, 229, 229);
  cursor: pointer;
}
.product-details {
  display: flex;
  flex-direction: column;
  font-size: 20px;
}
.product-price {
  color: green;
  font-size: 24px;
  
  font-weight: bold;
}
.card-text {
  text-align: left;
}
</style>
