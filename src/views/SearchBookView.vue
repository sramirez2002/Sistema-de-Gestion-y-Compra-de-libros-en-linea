<template>
  <div class="fluid-container">
    <ToolBar :vista="name" />

    <div class="container-fluid p-3">
      <div class="row">
        <div class="col-md-4 justify-margin-left">
          <!-- Etiquetas de búsqueda -->
          <h4 style="color: #230007">Etiquetas de búsqueda</h4>
          <div v-for="filtro in filtros" :key="filtro">
            <label>
              <input type="checkbox" v-model="filtrosSeleccionados" :value="filtro" @change="VerificarFiltros" />
              {{ filtro }}
            </label>
          </div>
          <button type="button" @click="limpiarLibros" class="TardisBoton"
            style="margin-top: 1cap;">Limpiar filtros</button>
        </div>

        <div class="col-md-8">
          <!-- Campos de búsqueda -->
          <h4>Campos de búsqueda</h4>
          <input v-model="SearchBook.Titulo" v-if="filtrosSeleccionados.includes('Titulo')" type="text"
            placeholder="Titulo" class="form-control mb-2" @input="VerificarFiltros" />

          <input v-model="SearchBook.Autor" v-if="filtrosSeleccionados.includes('Autor')" type="text"
            placeholder="Autor del libro" class="form-control mb-2" @input="VerificarFiltros" />

          <input v-model="SearchBook.ISSN" @input="filterISSN" v-if="filtrosSeleccionados.includes('ISSN')"
            type="number" id="issn" placeholder="ISSN" class="form-control mb-2" min="0" step="1" />

          <div v-if="filtrosSeleccionados.includes('N° de Páginas')" class="row search-row" style="padding-bottom: 0%;">
            <div class="col-12 col-md-1 text-range">
              Minimo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.Npages.inicio" type="number" id="numberpages" placeholder="Número de páginas"
                class="form-control mb-2" min="1" step="1" @input="filterPages('inicio')" />
            </div>
            <div class="col-12 col-md-1 text-range">
              Maximo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.Npages.fin" type="number" id="numberpages" placeholder="Número de páginas"
                class="form-control mb-2" min="1" step="1" @input="filterPages('fin')" />
            </div>
          </div>


          <!-- La separacion entre filas debe ser minima -->
          <div v-if="filtrosSeleccionados.includes('Fecha de Publicación')" class="row search-row"
            style="padding-bottom: 0%;">
            <div class="col-12 col-md-1 text-range">
              Minimo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.FechaPublicacion.inicio" type="date" id="publicationdate"
                placeholder="DD/MM/YYYY" class="form-control mb-2" :min="getminDate()" :max="getmaxDate()"
                @input="filterFechaPublicacion(SearchBook.FechaPublicacion.inicio)" />
            </div>
            <div class="col-12 col-md-1 text-range">
              Maximo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.FechaPublicacion.fin" type="date" id="publicationdate" placeholder="DD/MM/YYYY"
                class="form-control mb-2" :min="getminDate()" :max="getmaxDate()"
                @input="filterFechaPublicacion(SearchBook.FechaPublicacion.fin)" />
            </div>
          </div>



          <input v-model="SearchBook.Editorial" v-if="filtrosSeleccionados.includes('Editorial')" type="text"
            placeholder="Editorial del libro" class="form-control mb-2" @input="VerificarFiltros" />

          <select v-model="SearchBook.Estado" v-if="filtrosSeleccionados.includes('Estado')" id="Estado"
            class="form-control mb-2" @change="VerificarFiltros">
            <option disabled value="">Seleccionar estado</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Usado">Usado</option>
          </select>

          <select v-model="SearchBook.Genero" v-if="filtrosSeleccionados.includes('Género')" id="gender"
            class="form-control mb-2" @change="VerificarFiltros">
            <option disabled value="">Seleccione un Género</option>
            <option v-for="genero in generos" :key="genero.nombre" :value="genero.value">{{
              genero.nombre }}</option>
          </select>

          <div v-if="filtrosSeleccionados.includes('Año de Publicación')" class="row search-row"
            style="padding-bottom: 0%;">
            <div class="col-12 col-md-1 text-range">
              Minimo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.AnioPublicacion.inicio" type="number" id="publicationyear"
                placeholder="Año de publicación" class="form-control mb-2" min="1924" max="2026" step="1"
                @input="filterAnioPublication('inicio')" />
            </div>
            <div class="col-12 col-md-1 text-range">
              Maximo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.AnioPublicacion.fin" type="number" id="publicationyear"
                placeholder="Año de publicación" class="form-control mb-2" min="1924" max="2026" step="1"
                @input="filterAnioPublication('fin')" />
            </div>
          </div>

          <div v-if="filtrosSeleccionados.includes('Precio')" class="row search-row" style="padding-bottom: 0%;">
            <div class="col-12 col-md-1 text-range">
              Minimo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.Precio.inicio" type="number" id="Precio" placeholder="Precio"
                class="form-control mb-2" min="1" step="1" @input="filterPrecio('inicio')" />
            </div>
            <div class="col-12 col-md-1 text-range">
              Maximo:
            </div>
            <div class="col-12 col-md-5">
              <input v-model="SearchBook.Precio.fin" type="number" id="Precio" placeholder="Precio"
                class="form-control mb-2" min="1" step="1" @input="filterPrecio('fin')" />
            </div>
          </div>

          <select v-model="SearchBook.listaIdiomas" id="Idioma" v-if="filtrosSeleccionados.includes('Idioma')"
            class="form-select mb-2" @change="VerificarFiltros">
            <option value="" disabled selected>Seleccionar idioma</option>
            <option v-for="idioma in listaIdiomas" :key="idioma.nombre" :value="idioma.nombre">{{ idioma.nombre }}
            </option>
          </select>

          <!-- Agregar más campos según los filtros disponibles -->

          <button :disabled="FiltroVacios" type="button" @click="buscarLibros"
            class="TardisBoton">Buscar</button>

          <!-- Resultados de la búsqueda -->
          <ul v-if="resultados.length > 0" class="mt-3">
            <ResultBook v-for="libro in resultados" :key="libro.ISSN" :libro="libro" :Data="userData" />
          </ul>
          <p v-else class="mt-3">No se encontraron resultados.</p>
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
import ResultBook from '@/components/ResultBook.vue'; // Importa el componente ResultBook
import idiomas from '@/assets/idiomas.json';
import generos from '@/assets/generos.json';
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';

export default {
  props: ['UserData'],
  components: {
    ResultBook, // Registra el componente ResultBook
    ToolBar,
    CargandoV
  },
  data() {
    return {
      name: 'SearchBookView',
      userData: {},
      SearchBook: {
        listaIdiomas: [],
        Autor: '',
        ISSN: '',
        Titulo: '',
        Npages: { inicio: '', fin: '' },
        FechaPublicacion: { inicio: '', fin: '' },
        Editorial: '',
        Estado: '',
        Genero: '',
        AnioPublicacion: { inicio: '', fin: '' },
        Precio: { inicio: '', fin: '' }
      },
      filtros: ['Titulo', 'Autor', 'ISSN', 'N° de Páginas', 'Fecha de Publicación', 'Editorial', 'Estado', 'Género', 'Año de Publicación', 'Precio', 'Idioma'],
      filtrosLlaves: { 'Titulo': 'Titulo', 'Autor': 'Autor', 'ISSN': 'ISSN', 'N° de Páginas': 'Npages', 'Fecha de Publicación': 'FechaPublicacion', 'Editorial': 'Editorial', 'Estado': 'Estado', 'Género': 'Genero', 'Año de Publicación': 'AnioPublicacion', 'Precio': 'Precio', 'Idioma': 'listaIdiomas' },
      filtrosSeleccionados: ['Titulo'],
      AñoPublicacionError: false,
      backendUrl: '',
      resultados: [], // Añadido para almacenar los resultados de la búsqueda
      loading: false,
      FiltroVacios: true,
    };
  },
  mounted() {
    this.fetchBackendUrl();
  },
  created() {
    this.LoadUserData();
    this.cargarGeneros();
    this.cargarListaIdiomas();
  },
  methods: {

    limpiarLibros() {
      this.SearchBook = {
        listaIdiomas: [],
        Autor: '',
        ISSN: '',
        Titulo: '',
        Npages: { inicio: '', fin: '' },
        FechaPublicacion: { inicio: '', fin: '' },
        Editorial: '',
        Estado: '',
        Genero: '',
        AnioPublicacion: { inicio: '', fin: '' },
        Precio: { inicio: '', fin: '' }
      };
      this.filtrosSeleccionados = ['Titulo'];
    },
    VerificarFiltros() {


      if (this.filtrosSeleccionados.length > 0) {
        for (let i = 0; i < this.filtrosSeleccionados.length; i++) {
          let filtro = this.filtrosLlaves[this.filtrosSeleccionados[i]];
          let Valor = this.SearchBook[filtro];
          //Si el valor es un numero imprime true
          if (filtro === 'Precio' || filtro === 'Npages' || filtro === 'AnioPublicacion') {
            console.log(Valor.inicio, Valor.fin);
            if ((isNaN(Valor.inicio) && isNaN(Valor.fin)) ||
              (Valor.inicio === '' && Valor.fin === '') ||
              (Valor.inicio === '' && isNaN(Valor.fin)) ||
              (isNaN(Valor.inicio) && Valor.fin === '')
            ) {
              this.FiltroVacios = true;
              break;
            }
            else {
              this.FiltroVacios = false;
            }
          } else if (filtro === 'FechaPublicacion') {
            if (Valor.inicio === '' && Valor.fin === '') {
              this.FiltroVacios = true;
              break;
            } else {
              this.FiltroVacios = false;
            }
          } else if (typeof Valor === 'number') {
            if (isNaN(Valor)) {
              this.FiltroVacios = true;
              break;
            } else if (Valor === '') {
              this.FiltroVacios = true;
              break;
            }
            else {
              this.FiltroVacios = false;
            }
          } else if (Valor === '') {
            this.FiltroVacios = true;
            break;
          } else {
            this.FiltroVacios = false;
          }
        }
      } else {
        this.FiltroVacios = true;
      }
    },
    LoadUserData() {

      //pasar de texto a json una vatiable llamada localStorage.UserData
      if (this.$route.params.UserData !== undefined)
        this.userData = JSON.parse(localStorage.UserData);
      else
        this.userData = { "Tipo": "Visitante" };
      this.buscarLibros();
    },
    cargarListaIdiomas() {
      this.listaIdiomas = idiomas;
    },
    cargarGeneros() {
      this.generos = generos;
    },
    getmaxDate() {
      const today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
      let year = today.getFullYear();

      // Ajuste para que el día y el mes tengan dos dígitos
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }
      // Uso correcto de comillas invertidas y ${} para interpolación
      return `${year}-${month}-${day}`;
    },
    getminDate() {
      const today = new Date();
      let year = today.getFullYear();
      year = year - 100;
      return `${year}-01-01`;
    },


    // Seccion generica para filtrar campos de texto//
    filterFechaPublicacion(input) {
      console.log(input);
      const maxYear = this.getmaxDate().slice(0, 4);
      const minYear = this.getminDate().slice(0, 4);
      // Impide la entrada de caracteres que no sean dígitos
      if (input !== '') {
        if (!(input.toString().slice(0, 4) <= maxYear && input.toString().slice(0, 4) >= minYear)) {
          this.FiltroVacios = true;
        } else {
          this.VerificarFiltros();
        }
      }
    },

    filterExistentias() {
      // Impide la entrada de caracteres que no sean dígitos
      const input = this.filterNumber(this.SearchBook.Existencias);
      if (input > 500) {
        this.SearchBook.Existencias = input.toString().slice(0, 3);
      } else {
        this.SearchBook.Existencias = input;
      }
      this.VerificarFiltros();
    },
    filterAnioPublication(tipo) {
      // Impide la entrada de caracteres que no sean dígitos
      const Valor = this.SearchBook.AnioPublicacion[tipo];
      const input = this.filterNumber(Valor);
      if (input > 2026) {
        this.SearchBook.AnioPublicacion[tipo] = input.toString().slice(0, 4);
      } else if (input < 1924) {
        this.SearchBook.AnioPublicacion[tipo] = input;
      } else {
        this.SearchBook.AnioPublicacion[tipo] = input;
      }
      this.VerificarFiltros();
    },
    filterNumber(Value) {
      // Impide la entrada de caracteres que no sean dígitos
      console.log(Value);
      const input = parseInt(Value.replace(/[D]/g, ''));
      return input;
    },
    filterPages(tipo) {
      // Impide la entrada de caracteres que no sean dígitos
      let input = this.filterNumber(this.SearchBook.Npages[tipo]);
      if (input === 0) {
        input = 1;
      }
      if (input > 9999) {
        this.SearchBook.Npages[tipo] = input.toString().slice(0, 4);
      } else {
        this.SearchBook.Npages[tipo] = input;
      }
      this.VerificarFiltros();
    },
    filterPrecio(tipo) {
      // Impide la entrada de caracteres que no sean dígitos
      let valor = this.SearchBook.Precio[tipo];
      let input = this.filterNumber(valor);
      if (input === 0) {
        input = 1;
      }
      if (input > 99999999) {
        this.SearchBook.Precio[tipo] = input.toString().slice(0, 8);
      } else {
        this.SearchBook.Precio[tipo] = input;
      }
      this.VerificarFiltros();
    },
    filterISSN() {
      // Impide la entrada de caracteres que no sean dígitos
      const input = this.filterNumber(this.SearchBook.ISSN);
      if (input > 9999999999) {
        this.SearchBook.ISSN = input.toString().slice(0, 10);
      } else {
        this.SearchBook.ISSN = input;
      }
      this.VerificarFiltros();
    },
    /////////////////////Fin de seccion generica para filtrar campos de texto////////////////////////

    fetchBackendUrl() {
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

    async buscarLibros() {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // espera hasta tener la url del back
      const filtros = {};
      if (this.filtrosSeleccionados.includes('Titulo')) filtros.Titulo = this.SearchBook.Titulo;
      if (this.filtrosSeleccionados.includes('Autor')) filtros.Autor = this.SearchBook.Autor;
      if (this.filtrosSeleccionados.includes('ISSN')) filtros.ISSN = this.SearchBook.ISSN;
      if (this.filtrosSeleccionados.includes('N° de Páginas')) {
        filtros.Npages = {};
        filtros.Npages.inicio = this.SearchBook.Npages.inicio;
        filtros.Npages.fin = this.SearchBook.Npages.fin;
      }
      if (this.filtrosSeleccionados.includes('Fecha de Publicación')) {
        filtros.FechaPublicacion = {};
        filtros.FechaPublicacion.inicio = this.SearchBook.FechaPublicacion.inicio;
        filtros.FechaPublicacion.fin = this.SearchBook.FechaPublicacion.fin;
      }
      if (this.filtrosSeleccionados.includes('Editorial')) filtros.Editorial = this.SearchBook.Editorial;
      if (this.filtrosSeleccionados.includes('Estado')) filtros.Estado = this.SearchBook.Estado;
      if (this.filtrosSeleccionados.includes('Género')) filtros.Genero = this.SearchBook.Genero;
      if (this.filtrosSeleccionados.includes('Año de Publicación')) {
        filtros.AnioPublicacion = {};
        filtros.AnioPublicacion.inicio = this.SearchBook.AnioPublicacion.inicio;
        filtros.AnioPublicacion.fin = this.SearchBook.AnioPublicacion.fin;
      }
      if (this.filtrosSeleccionados.includes('Precio')) {
        filtros.Precio = {};
        filtros.Precio.inicio = this.SearchBook.Precio.inicio;
        filtros.Precio.fin = this.SearchBook.Precio.fin;
      }
      if (this.filtrosSeleccionados.includes('Idioma')) filtros.listaIdiomas = this.SearchBook.listaIdiomas;

      if (!this.backendUrl) {
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        this.loading = false;
        return;
      }

      const headers = {
        'Action': 'GetBooks'
      };


      // Hacer la solicitud al backend para buscar libros con los filtros
      try {
        const response = await axios.post(this.backendUrl, filtros, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          this.loading = false;
          this.resultados = response.data.Data;
        } else {
          this.loading = false;
          alert("Error: " + response.data.Data);
        }

      } catch (error) {
        this.loading = false;
        console.error('Error al buscar libros:', error);
        this.resultados = []; // Limpiar resultados en caso de error
      }
    }
  }
};
</script>

<style scoped>
.search-row {
  margin-bottom: 10px;
  /* Ajusta este valor según tus preferencias */
}

.text-range {
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  align-items: center;
  text-align: center;
  align-items: center;

  /* Ajusta este valor según tus preferencias */
}
</style>
