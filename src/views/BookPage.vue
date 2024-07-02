<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->

    <div class="container-fluid p-5">

      <h2>{{ bookInfo.Titulo }}</h2>
      <div class="row">
        <!-- Imagen del Libro -->
        <!-- Información del Libro -->
        <div>
          <div class="row">
            <div class="col-9 col-md-9 mb-1">
              <Book3DView v-if="viewKey" />
            </div>
            <div class="col-12  col-md-3 mb-1 card ">
              <div class="row">
                <div class="col-1 col-md-1"></div>
                <div class="col-10 row">
                  <h4 class="text-muted">Autor: {{ bookInfo.Autor }}</h4>
                  <h4 class="text-success">Precio: COP {{ Precio }}</h4>
                  <p><strong>Estado:</strong> {{ bookInfo.Estado }}</p>
                  <p><strong>Existencias:</strong> {{ bookInfo.Existencias }}</p>
                  <select v-if="Tipo === 'Cliente'" v-model="LibrosComprar" id="LibrosComprar" class="form-select">
                    <option selected v-for="cantidad in CantidadDisponible" :key="cantidad.nombre"
                      :value="cantidad.numero">{{
                        cantidad.nombre }}</option>
                  </select>
                  <button v-if="Tipo === 'Cliente'" :disabled="MaximoDisponible === 0" class="btn btn-primary btn-lg mt-3 ButtonTardis"
                    @click="BuyBook">Añadir al Carrito</button>
                  <button v-if="Tipo === 'Cliente'" :disabled="MaximoDisponible === 0" class="btn btn-primary btn-lg mt-3 ButtonTardis"
                    @click="ReservarBook">Reservar</button>
                </div>
                <div class="col-1 col-md-1"></div>
              </div>
            </div>
            <div class="col-12 col-md-12 card" style="background-color: #f9f9f9">
              <p style="text-align: center;"><strong>Características del producto</strong></p>
              <div class="row">
                <div class="col-12 mb-1 col-md-6">
                  <p><strong>Género:</strong> {{ Genero }}</p>
                </div>
                <div class="col-12 mb-1 col-md-6">
                  <p><strong>Editorial:</strong> {{ bookInfo.Editorial }}</p>
                </div>
                <div class="col-12 mb-1 col-md-6">
                  <p><strong>Año de Publicación:</strong> {{ bookInfo.AnioPublicacion }}</p>
                </div>
                <div class="col-12 mb-1 col-md-6">
                  <p><strong>ISBN:</strong> {{ bookInfo.ISSN }}</p>
                </div>
                <div class="col-12 mb-1 col-md-6">
                  <p><strong>Número de Páginas:</strong> {{ bookInfo.Npages }}</p>
                </div>
                <div class="col-12 mb-1 col-md-6">
                  <p><strong>Idiomas Disponibles:</strong> {{ bookInfo.listaIdiomas }}</p>
                </div>

              </div>

            </div>
          </div>
          <!-- <button class="btn btn-primary btn-lg mt-3 ButtonTardis">Añadir al Carrito</button> -->
        </div>
      </div>
    </div>

    <!-- Cargando -->
    <CargandoV :Show="loading" />
    <!-- Fin Cargando -->
  </div>
</template>

<script>
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';
import Book3DView from '@/components/Book3DView.vue';

export default {
  name: 'BookPageView',
  components: {
    ToolBar,
    CargandoV,
    Book3DView
  },
  data() {
    return {
      bookInfo: {
        AnioPublicacion: '',  // Nuevo campo solo para el año
        Autor: '',
        listaIdiomas: "",
        ISSN: '',
        Titulo: '',
        Npages: '',
        FechaPublicacion: '', // Se mantiene para la fecha completa
        Editorial: '',
        Genero: '',
        Estado: '',
        Precio: '',
        Existencias: ''
      },
      backendUrl: '',
      name: 'BookPageView',
      loading: false,
      Precio: "",
      Genero: "",
      filtros: { ISSN: "" },
      LibrosComprar: 0,
      CantidadDisponible: [{ numero: 1, nombre: "1 unidad" }],
      MaximoDisponible: 3,
      viewKey: false,
      Tipo: JSON.parse(localStorage.UserData).Tipo
    };
  },
  created() {
    this.loadBookData();
  },
  computed: {

  },
  methods: {
    Formatear() {
      // Formatea el precio a moneda
      this.Precio = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(this.bookInfo.Precio);
      //Formatea el genero para estar en mayuscula la primera letra
      this.Genero = this.bookInfo.Genero.charAt(0).toUpperCase() + this.bookInfo.Genero.slice(1);
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
    async ReservarBook(){
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
      this.bookInfo.Cantidad = this.LibrosComprar;
      const NuevaCompra = { Fecha: new Date().toISOString().slice(0, 10),
          Libros: [this.bookInfo],
          Total: this.bookInfo.Precio * this.LibrosComprar,
          Estado: "Reservado"
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
          alert("Reserva realizada con éxito");
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
    async BuyBook() {
      this.loading = true;

      // espera 3 segundos

      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }
      let Auxiliar = JSON.parse(localStorage.UserData);

      const headers = {
        'Action': 'UpdateCar'
      };
      Auxiliar.Carrito.push({ ISSN: this.bookInfo.ISSN, Cantidad: this.LibrosComprar });

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
    saveModelToIndexedDB(base64, fileName) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("3DModelsDB", 1);

        request.onupgradeneeded = function (event) {
          const db = event.target.result;
          const objectStore = db.createObjectStore("models", { keyPath: "fileName" });
          objectStore.transaction.oncomplete = function () {
            const modelObjectStore = db.transaction("models", "readwrite").objectStore("models");
            modelObjectStore.add({ fileName, base64 });
            resolve();
          };
        };

        request.onsuccess = function (event) {
          const db = event.target.result;
          const transaction = db.transaction(["models"], "readwrite");
          const objectStore = transaction.objectStore("models");
          objectStore.put({ fileName, base64 });
          transaction.oncomplete = function () {
            resolve();
          };
          transaction.onerror = function (event) {
            reject("Error al guardar el modelo en IndexedDB: " + event.target.error);
          };
        };

        request.onerror = function (event) {
          reject("Error al abrir IndexedDB: " + event.target.error);
        };
      });
    },

    async loadBookModel() {
      console.log("Cargando modelo del libro");
      const headers = {
        'Action': 'GetBookModel'
      };
      const Body = { ISSN: this.$route.params.id };
      try {
        const response = await axios.post(this.backendUrl, Body, { headers });
        if (response.data && response.data.Status === "True") {
          const bookModelBase64 = response.data.File;
          this.saveModelToIndexedDB(bookModelBase64, response.data.FileName);
          localStorage.setItem('bookModelFileName', response.data.FileName);
          console.log(`Modelo guardado en IndexedDB con el nombre ${response.data.FileName}`);
          this.viewKey = true;
        } else {
          alert("Error 1: " + response.data.Data);
        }
      } catch (error) {
        alert("Error: " + error);
      }
    },

    async loadBookData() {
      this.loading = true;
      this.fetchBackendUrl();

      // espera 3 segundos
      await new Promise(resolve => setTimeout(resolve, 1000)); // espera hasta tener la url del back

      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }
      // Hacer la solicitud al backend para buscar libros con los filtros
      const headers = {
        'Action': 'GetBookByISSN'
      };
      this.filtros = { ISSN: this.$route.params.id };

      // Hacer la solicitud al backend para buscar libros con los filtros
      try {
        const response = await axios.post(this.backendUrl, this.filtros, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          this.loadBookModel();
          this.loading = false;
          this.resultados = response.data.Data;
          this.CantidadDisponible = [];
          if (this.resultados[0].Existencias > 3) {
            this.MaximoDisponible = 3;
          } else if (this.resultados[0].Existencias > 0) {
            this.MaximoDisponible = this.resultados[0].Existencias;
          } else {
            this.MaximoDisponible = 0;
            this.CantidadDisponible = [{ numero: 0, nombre: "No hay unidades" }];
          }

          for (let i = 1; i <= this.MaximoDisponible; i++) {
            this.CantidadDisponible.push({ numero: i, nombre: i + " unidades" });
          }
          // Selección por defecto
          this.LibrosComprar = this.CantidadDisponible[0].numero;
        } else {
          this.loading = false;
          alert("Error: " + response.data.Data);
        }

      } catch (error) {
        this.loading = false;
        alert("Error: " + error);
        this.resultados = []; // Limpiar resultados en caso de error
      }
      if (this.resultados.length > 0) {
        this.bookInfo = this.resultados[0];
      } else {
        this.$router.push('/404'); // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
      }
      this.Formatear();
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.compras {
  border: 1px solid #af4040;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  /*esta pegado a la derecha de la pantalla */
}

.detalles {
  border: 1px solid #af4040;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.row {
  text-align: left;
}

.txt-lg {
  font-size: 1.3rem;
}

.img-fluid {
  max-height: 400px;
}

.review {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2,
h3 {
  color: #230007;
}

h4.text-muted {
  color: #6c757d;
}

.text-success {
  color: #28a745;
}

.btn-primary {
  background-color: #230007;
  border-color: #230007;
}

.btn-primary:hover {
  background-color: #5a0013;
  border-color: #5a0013;
}

.ButtonTardis:disabled {
  background-color: #929292;
  color: white;
  cursor: not-allowed;
  border: none;
}

.ButtonTardis {
  background-color: #230007;
  color: white;
  max-width: 300px;
  border: none;
}

.ButtonTardis:hover {
  background-color: rgb(6, 110, 0);
  color: white;
  border: none;
}

.card {
  padding: 15px;
}
</style>