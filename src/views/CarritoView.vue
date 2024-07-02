<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <h1 class="text-center p-3" style="color: #230007;">Carrito de compras</h1>

    <div class="row">
      <div class="container mt-4 col-12 col-md-8">
        <ul v-if="books.length > 0" class="list-unstyled">
          <li v-for="libro in books" :key="libro.ISSN">
            <CarBook :libro="libro" :backendUrl = "backendUrl" />
          </li>
        </ul>
        <div v-else>
          <div>
            <p class="text-center">¡Empieza un carrito de compras!</p>
            <router-link to="/search-book" class="TardisBoton">Descrubir libros</router-link>
          </div>
        </div>
      </div>
      <div class="container mt-4 col-12 col-md-4">
        <div class="card">
          <div  v-if="books.length > 0" class="card-body">
            <h5 class="card-title">Resumen de compra</h5>
            <!-- Añade una linea negra y gruesa de izquierda a derecha -->
            <hr class="hr-gruesa">
            <p class="card-text"> <strong>Total de libros: {{ TotalLibros }}</strong> </p>
            <p class="card-text product-price">Total: COP {{ Total }}</p>
            <button @click=EnviaPagar class="TardisBoton">Proceder al pago</button>
          </div>
          <div v-else class="card-body">
            <h5 class="card-title">Resumen de compra</h5>
            <!-- Añade una linea negra y gruesa de izquierda a derecha -->
            <hr class="hr-gruesa">
            <p class="card-text"> Aquí verás los importes de tu compra una vez que agregues productos.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cargamdo -->
    <CargandoV :Show="loading" />
    <!--Fin Cargamdo -->
  </div>
</template>

<script>
import axios from 'axios';
import CarBook from '@/components/CarBook.vue';
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';

export default {
  components: {
    ToolBar,
    CarBook,
    CargandoV // Registra el componente ResultBook
  },
  name: 'CarritoView',
  data() {
    return {
      books: [],
      name: 'CarritoView',
      loading: false,
      Total : 0,
      TotalLibros : 0
    };
  },
  methods: {
    EnviaPagar(){
      const userData = JSON.parse(localStorage.getItem('UserData')).MetodosPago;
      if (userData.length === 0) {
        alert('Debes agregar un método de pago antes de proceder al pago.');
        this.$router.push('/metodos-pago');
        return;
      }
      this.$router.push('/checkout');
    },
    Formatear() {
      // Formatea el precio a moneda
      this.Total = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(this.Total);
      },
    fetchBackendUrl() {
      console.log('Fetching backend URL...');
      const configUrl = 'https://backends-15b02-default-rtdb.firebaseio.com/Urls/Libreria.json';
      axios.get(configUrl)
        .then(response => {
          this.backendUrl = response.data;
        })
        .catch(error => {
          console.error(error);
          alert("Error al intentar obtener la URL del backend. Por favor, inténtalo de nuevo.");
        });
    },

    async fetchCarBooks() {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // espera hasta tener la url del back


      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }

      const headers = {
        'Action': 'GetCarBooks'
      };
      const Body = JSON.parse(localStorage.UserData).Carrito
      try {
        const response = await axios.post(this.backendUrl, Body, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          this.loading = false;
          this.books = response.data.Data;
          this.Total = this.books.reduce((acc, libro) => parseInt(acc) + parseInt(libro.Precio), 0);
          
          // Recorre todos los libors y suma la cantidad de libros
          this.TotalLibros = this.books.reduce((acc, libro) => parseInt(acc) + parseInt(libro.Cantidad), 0);
          this.Formatear();
        } else {
          this.loading = false;
          alert("error: " + response.data.Data);
        }

      } catch (error) {
        this.loading = false;
        console.error('Error al buscar libros:', error);
        this.books = []; // Limpiar resultados en caso de error
      }
    }
  },
  mounted() {
    this.fetchBackendUrl();
  },
  created() {
    this.fetchCarBooks();
  }
}
</script>

<style scoped>
.card {
  border-color: #4c0000;
  margin-bottom: 1%;
  margin-left: 5%;
  margin-right: 5%;
}

.product-price {
  color: green;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
}
.hr-gruesa{
  border-top: 1px solid #4c0000;
  /*Debe no ser clara para que se vea la linea*/
  opacity: 1;
}
</style>