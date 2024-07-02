<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <h1 class="text-center p-3" style="color: #230007;">Finalizar compra</h1>

    <div class="row">
      <div class="container mt-4 col-12 col-md-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title h5-titulo">1) Metodo de pago</h5>
            <p class="card-text">Seleccione un metodo de pago:</p>
            <select v-model="MetodoDePago" id="MetodoDePago" class="form-select">
              <option v-for="card in cards" :key="card.cardNumber" :value="card.cardNumber">{{ "**** **** **** " +
                card.cardNumber.slice(-4) }}
              </option>
            </select>
            <hr class="hr-gruesa">
            <h5 class="card-title h5-titulo">2) Opcion de envio</h5>
            <p class="card-text">Seleccione una opcion de envio:</p>
            <select v-model="MetodoDeEnvio" id="MetodoDePago" class="form-select" @change="CalcularTotalEnvio">
              <option value="Domicilio">
                Domicilio
              </option>
              <option value="Recoger">
                Recoger en tienda
              </option>
            </select>
            <div v-if="MetodoDeEnvio === 'Domicilio'">
              <p class="card-text">Costo de envio: <strong>COP $ 7.000,00</strong> </p>
            </div>
            <div v-else>
              <p class="card-text">Costo de envio: <strong>Gratis</strong> </p>
              <p class="card-text">Ubicacion para recoger:</p>
              <select v-model="UbicacionRecoger" id="UbicacionRecoger" class="form-select">
                <option value="Sede Alamos">
                  Sede Alamos
                </option>
                <option value="Sede Centro">
                  Sede Centro
                </option>
                <option value="Sede Cuba">
                  Sede Cuba
                </option>
              </select>
            </div>
            <hr class="hr-gruesa">
            <h5 class="card-title h5-titulo">3) Revisar los artículos de la compra</h5>
            <!-- Añade una linea negra y gruesa de izquierda a derecha -->
            <ul v-if="books.length > 0" class="list-unstyled">
              <li v-for="libro in books" :key="libro.ISSN">
                <PayBook :libro="libro" :backendUrl="backendUrl" />
              </li>
            </ul>

          </div>
        </div>
      </div>
      <div class="container mt-4 col-12 col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Resumen de compra</h5>
            <!-- Añade una linea negra y gruesa de izquierda a derecha -->
            <hr class="hr-gruesa">
            <p class="card-text"> <strong>Productos: {{ Total }}</strong> </p>
            <p v-if="MetodoDeEnvio === 'Domicilio'" class="card-text"> <strong>Envio: COP 7.000,00</strong> </p>
            <p v-else class="card-text"> <strong>Envio: Gratis</strong> </p>
            <p class="card-text product-price">Total: COP {{ (TotalEnvio) }}</p>
            <button @click="Payment()" class="TardisBoton">Terminar compra</button>
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
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';
import PayBook from '@/components/PayBook.vue';

export default {
  components: {
    ToolBar,
    PayBook, // Registra el componente PayBook
    CargandoV // Registra el componente ResultBook
  },
  name: 'PagarView',
  data() {
    return {
      books: [],
      name: 'PagarView',
      loading: false,
      cards: JSON.parse(localStorage.getItem('UserData')).MetodosPago,
      Total: 0,
      TotalEnvio: 0,
      Envio: 7000,
      TotalLibros: 0,
      MetodoDePago: "",
      MetodoDeEnvio: "Domicilio",
      UbicacionRecoger: "Sede Alamos"
    };
  },
  methods: {
    async Payment() {
      this.loading = true;

      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }

      const headers = {
        'Action': 'Pagatotal'
      };
      let Auxiliar = JSON.parse(localStorage.UserData)
      Auxiliar.Carrito = [];
      const NuevaCompra = { Fecha: new Date().toISOString().slice(0, 10),
          Libros: this.books,
          Total: this.TotalEnvio,
          MetodoDePago: this.MetodoDePago,
          MetodoDeEnvio: this.MetodoDeEnvio,
          UbicacionRecoger: this.UbicacionRecoger,
          Estado: "Enviado"
        };
      if (Auxiliar.Historial) {
        Auxiliar.Historial.push(NuevaCompra);
      } else {
        Auxiliar.Historial = [NuevaCompra];
      }

      try {
        const response = await axios.post(this.backendUrl, Auxiliar, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          this.loading = false;
          localStorage.UserData = JSON.stringify(Auxiliar);
          this.$router.push("/search-book");
        } else {
          this.loading = false;
          alert("error: " + response.data.Data);
        }

      } catch (error) {
        this.loading = false;
        console.error('Error al comprar libros:', error);
        this.books = []; // Limpiar resultados en caso de error
      }
    },
    CalcularTotalEnvio() {
      this.Total = this.books.reduce((acc, libro) => parseInt(acc) + parseInt(libro.Precio * libro.Cantidad), 0);
      this.TotalLibros = this.books.reduce((acc, libro) => parseInt(acc) + parseInt(libro.Cantidad), 0);
      if (this.MetodoDeEnvio === "Domicilio") {
        this.TotalEnvio = this.Total + this.Envio;
      } else {
        this.TotalEnvio = this.Total;
      }
      this.Formatear();
    },
    Formatear() {
      // Formatea el precio a moneda
      this.Total = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(this.Total);
      this.TotalEnvio = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(this.TotalEnvio);
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

          this.MetodoDePago = this.cards[0].cardNumber;
          // Recorre todos los libors y suma la cantidad de libros
          this.CalcularTotalEnvio();
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

.hr-gruesa {
  border-top: 1px solid #4c0000;
  /*Debe no ser clara para que se vea la linea*/
  opacity: 1;
}

.h5-titulo {
  color: #4c0000;
  font-weight: bold;
  text-align: left;
}
</style>