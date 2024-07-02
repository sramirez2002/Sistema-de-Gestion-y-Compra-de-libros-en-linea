<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->


    <div class="container-fluid p-5">
      <h1 class="text-center p-3" style="color: #230007;">Editar libro</h1>
      <div class="container-fluid p-5">
        <div class="row">
          <div class="col-12 col-md-4 d-flex align-items-center justify-content-center text-center p-4">
            <img alt="image" :src="require('@/assets/editbook.png')" class="img-fluid mb-2" />
          </div>

          <div class="col-12 col-md-8">
            <div class="row">

              <!-- ISSN - No editable -->
              <div class="col-12 col-md-6 mb-3">
                <label for="issn" class="form-label txt-lg" style="color: #230007;">ISSN</label>
                <input v-model="bookForm.ISSN" type="number" id="issn" class="form-control" disabled />
              </div>

              <!-- TÍTULO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="title" class="form-label txt-lg" style="color: #230007;">Título</label>
                <input v-model="bookForm.Titulo" @blur="isFieldTouched.Titulo = true" type="text" id="title"
                  placeholder="Título" class="form-control" />
                <div v-if="!bookForm.Titulo.trim() && isFieldTouched.Titulo" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- AUTOR -->
              <div class="col-12 col-md-6 mb-3">
                <label for="author" class="form-label txt-lg" style="color: #230007;">Autor</label>
                <input v-model="bookForm.Autor" @blur="isFieldTouched.Autor = true" type="text" id="author"
                  placeholder="Autor" class="form-control" />
                <div v-if="!bookForm.Autor.trim() && isFieldTouched.Autor" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- GÉNERO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="gender" class="form-label txt-lg" style="color: #230007;">Género</label>
                <select v-model="bookForm.Genero" @blur="isFieldTouched.Genero = true" id="gender" class="form-control">
                  <option disabled value="">Seleccione una género</option>
                  <option v-for="genero in generos" :key="genero.nombre" :value="genero.value">{{
                    genero.nombre }}</option>
                  <!-- Añade más géneros según necesites -->
                </select>
                <div v-if="!bookForm.Genero && isFieldTouched.Genero" class="text-danger">Este campo es obligatorio.
                </div>
              </div>

              <!-- listaIdiomas -->
              <div class="col-12 col-md-6 mb-3">
                <label for="Idioma" class="form-label txt-lg" style="color: #230007;">Idioma</label>
                <select v-model="bookForm.listaIdiomas" @blur="isFieldTouched.listaIdiomas = true" id="Idioma"
                  class="form-select">
                  <option value="" disabled selected>Seleccionar idioma</option>
                  <option v-for="idiomas in listaIdiomas" :key="idiomas.nombre" :value="idiomas.nombre">{{
                    idiomas.nombre }}</option>
                </select>
                <div v-if="!bookForm.listaIdiomas && isFieldTouched.listaIdiomas" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>


              <!-- EDITORIAL -->
              <div class="col-12 col-md-6 mb-3">
                <label for="editorial" class="form-label txt-lg" style="color: #230007;">Editorial</label>
                <input v-model="bookForm.Editorial" @blur="isFieldTouched.Editorial = true" type="text" id="editorial"
                  placeholder="Editorial" class="form-control" />
                <div v-if="!bookForm.Editorial.trim() && isFieldTouched.Editorial" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- NÚMERO DE PÁGINAS -->
              <div class="col-12 col-md-6 mb-3">
                <label for="numberpages" class="form-label txt-lg" style="color: #230007;">Número de páginas</label>
                <input v-model="bookForm.Npages" @blur="isFieldTouched.Npages = true" type="number" id="numberpages"
                  class="form-control" min="1" @input="filterPages" />
                <div v-if="!bookForm.Npages && isFieldTouched.Npages" class="text-danger">Este campo es obligatorio.
                </div>
              </div>

              <!-- FECHA DE PUBLICACIÓN -->
              <div class="col-12 col-md-6 mb-3">
                <label for="publicationdate" class="form-label txt-lg" style="color: #230007;">Fecha de
                  publicación</label>
                <input v-model="bookForm.FechaPublicacion" @blur="isFieldTouched.FechaPublicacion = true" type="date"
                  id="publicationdate" class="form-control" :min="getminDate()" :max="getmaxDate()"
                  @input="publicationyear()" />
                <div v-if="!bookForm.FechaPublicacion && isFieldTouched.FechaPublicacion" class="text-danger">Este campo
                  es obligatorio.</div>
                <div v-if="FechaPublicacionError" class="text-danger">La fecha de publicación debe estar entre
                  {{ getminDate().slice(0, 4) }} y
                  {{ getmaxDate().slice(0, 4) }}.</div>
              </div>

              <!-- AÑO DE PUBLICACIÓN -->
              <div class="col-12 col-md-6 mb-3">
                <label for="publicationyear" class="form-label txt-lg" style="color: #230007;">Año de
                  publicación</label>
                <input v-model="bookForm.AnioPublicacion" type="number" :disabled="true" id="publicationyear"
                  class="form-control" min="1900" max="2026" />
              </div>

              <!-- ESTADO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="estado" class="form-label txt-lg" style="color: #230007;">Estado</label>
                <select v-model="bookForm.Estado" @blur="isFieldTouched.Estado = true" id="estado" class="form-select">
                  <option value="" disabled selected>Seleccionar estado</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                </select>
                <div v-if="!bookForm.Estado && isFieldTouched.Estado" class="text-danger">Este campo es obligatorio.
                </div>
              </div>

              <!-- PRECIO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="precio" class="form-label txt-lg" style="color: #230007;">Precio</label>
                <input v-model="bookForm.Precio" @blur="isFieldTouched.Precio = true" type="number" id="precio"
                  class="form-control" min="1" @input="filterPrecio" />
                <div v-if="!bookForm.Precio && isFieldTouched.Precio" class="text-danger">Este campo es obligatorio.
                </div>
              </div>

              <!-- EXISTENCIAS -->
              <div class="col-12 col-md-6 mb-3">
                <label for="existencias" class="form-label txt-lg" style="color: #230007;">Existencias</label>
                <input v-model="bookForm.Existencias" @blur="isFieldTouched.Existencias = true" type="number"
                  id="existencias" class="form-control" min="0" max="500" @input="filterExistentias" />
                <div v-if="!bookForm.Existencias && isFieldTouched.Existencias" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <div class="col-12 col-md-8">
                <label for="title" class="form-label txt-lg" style="color: #230007;">Sinopsis</label>
                <textarea v-model="bookForm.Sinopsis" @blur="isFieldTouched.Sinopsis = true" type="text" id="title"
                  placeholder="Sinopsis" class="form-control" />
                <div v-if="!bookForm.Sinopsis.trim() && isFieldTouched.Sinopsis" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>
              <div class="col-12  col-md-4 text-center mt-5">
                <button type="button" @click="GenerarSinopsis()" class="TardisBoton"
                  :disabled="!(bookForm.Autor && bookForm.Titulo)">Generar Sinopsis</button>
              </div>

              <!-- Botón de guardar cambios -->
              <div class="col-12 text-center mt-5">
                <button type="button" @click="updateBook" class="TardisBoton" :disabled="!isFormValid">Guardar
                  cambios</button>
              </div>
            </div>
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
import idiomas from '@/assets/idiomas.json';
import ToolBar from '@/components/ToolBar.vue';
import generos from '@/assets/generos.json';
import CargandoV from '@/components/CargandoV.vue';

export default {
  name: 'EditBookView',
  props: ['Libro'],
  components: {
    ToolBar,
    CargandoV

  },
  data() {
    return {
      bookForm: {
        listaIdiomas: [],
        Autor: '',
        ISSN: '',
        Titulo: '',
        Npages: '',
        FechaPublicacion: '', // Se mantiene para la fecha completa
        AnioPublicacion: '',  // Nuevo campo solo para el año
        Editorial: '',
        Genero: '',
        Estado: '',
        Precio: '',
        Existencias: '',
        Sinopsis: ''
      },
      isFieldTouched: {
        Titulo: false,
        Autor: false,
        Genero: false,
        listaIdiomas: false,
        Editorial: false,
        Npages: false,
        FechaPublicacion: false,// Asegúrate de manejar este campo en tu lógic
        Sinopsis: false
      },
      backendUrl: '',
      AnioPublicacionError: false,
      FechaPublicacionError: false,
      name: 'EditBookView',
      loading: false
    };
  },
  created() {
    this.cargarListaIdiomas();
    this.cargarGeneros();
    this.loadBookData();
  },
  computed: {
    isFormValid() {
      return Object.values(this.bookForm).every(x => x) && !this.FechaPublicacionError;
    }
  },
  methods: {

    cargarGeneros() {
      this.generos = generos;
    },
    // Seccion generica para filtrar campos de texto//
    filterFechaPublicacion() {
      const maxYear = this.getmaxDate().slice(0, 4);
      const minYear = this.getminDate().slice(0, 4);
      // Impide la entrada de caracteres que no sean dígitos
      const input = this.bookForm.FechaPublicacion;
      if (input !== '') {
        if (!(input.toString().slice(0, 4) <= maxYear && input.toString().slice(0, 4) >= minYear)) {
          this.FechaPublicacionError = true;
        }
        else {
          this.FechaPublicacionError = false;
        }
      }
    },
    filterExistentias() {
      // Impide la entrada de caracteres que no sean dígitos
      const input = this.filterNumber(this.bookForm.Existencias);
      if (input > 500) {
        this.bookForm.Existencias = input.toString().slice(0, 3);
      } else {
        this.bookForm.Existencias = input;
      }
    },
    filterNumber(Value) {
      // Impide la entrada de caracteres que no sean dígitos
      const input = parseInt(Value.replace(/\D/g, ''));
      return input;
    },
    filterPages() {
      // Impide la entrada de caracteres que no sean dígitos
      let input = this.filterNumber(this.bookForm.Npages);
      if (input === 0) {
        input = 1;
      }
      if (input > 99999) {
        this.bookForm.Npages = input.toString().slice(0, 5);
      } else {
        this.bookForm.Npages = input;
      }
    },
    filterPrecio() {
      // Impide la entrada de caracteres que no sean dígitos
      let input = this.filterNumber(this.bookForm.Precio);
      if (input === 0) {
        input = 1;
      }
      if (input > 99999999) {
        this.bookForm.Precio = input.toString().slice(0, 8);
      } else {
        this.bookForm.Precio = input;
      }
    },
    filterISSN() {
      // Impide la entrada de caracteres que no sean dígitos
      const input = this.filterNumber(this.bookForm.ISSN);
      if (input > 9999999999) {
        this.bookForm.ISSN = input.toString().slice(0, 10);
      } else {
        this.bookForm.ISSN = input;
      }
    },
    /////////////////////Fin de seccion generica para filtrar campos de texto////////////////////////

    publicationyear() {
      this.filterFechaPublicacion();
      this.bookForm.AnioPublicacion = this.bookForm.FechaPublicacion.split('-')[0];
    },
    getmaxDate() {
      const today = new Date();
      let year = today.getFullYear();
      year = year + 2;
      return `${year}-${12}-${31}`;
    },
    getminDate() {
      const today = new Date();
      let year = today.getFullYear();
      year = year - 100;
      return `${year}-01-01`;
    },

    cargarListaIdiomas() {
      this.listaIdiomas = idiomas;

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

    async GenerarSinopsis() {
      this.fetchBackendUrl();

      // espera 3 segundos
      await new Promise(resolve => setTimeout(resolve, 1000)); // espera hasta tener la url del back

      this.loading = true;
      const headers = {
        'Action': 'GenerarSinopsis'
      };
      // Convierte en numero el ISSN
      const Body = {
        Titulo: this.bookForm.Titulo,
        Autor: this.bookForm.Autor,
      }
      try {
        const response = await axios.post(this.backendUrl, Body, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          this.bookForm.Sinopsis = response.data.Data;
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error en la generacion de la sinopsis: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        // Aquí podrías manejar errores específicos de la petición
        alert("Error al intentar generacion de la sinopsis. Por favor, inténtalo de nuevo.");
      }
    },
    async updateBook() {
      this.loading = true;
      this.fetchBackendUrl();

      // espera 3 segundos
      await new Promise(resolve => setTimeout(resolve, 1000)); // espera hasta tener la url del back

      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }

      const allFieldsTouched = Object.values(this.bookForm).every(x => x);

      if (!allFieldsTouched) {
        this.loading = false;
        alert('Por favor, complete todos los campos antes de registrar.');
        return;
      }
      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }
      const headers = {
        'Action': 'ActualizarLibro'
      };
      // Convierte en numero el ISSN
      this.bookForm.ISSN = parseInt(this.bookForm.ISSN);
      try {
        const response = await axios.post(this.backendUrl, this.bookForm, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          alert("Edicion exitosa: " + response.data.Data); // Muestra el mensaje de éxito
          this.$router.push('/search-book'); // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error en la edicion: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        // Aquí podrías manejar errores específicos de la petición
        alert("Error al intentar editar. Por favor, inténtalo de nuevo.");
      }
    },
    loadBookData() {
      // Hacer la solicitud al backend para buscar libros con los filtros
      try {

        // Suponiendo que el backend responde con un arreglo de libros

        this.bookForm.ISSN = (this.$route.params.Libro.ISSN);
        this.bookForm.Titulo = this.$route.params.Libro.Titulo;
        this.bookForm.Autor = this.$route.params.Libro.Autor;
        this.bookForm.listaIdiomas = this.$route.params.Libro.listaIdiomas;
        this.bookForm.Editorial = this.$route.params.Libro.Editorial;
        this.bookForm.Npages = this.$route.params.Libro.Npages;
        this.bookForm.FechaPublicacion = this.$route.params.Libro.FechaPublicacion;
        this.bookForm.Genero = this.$route.params.Libro.Genero;
        this.bookForm.Estado = this.$route.params.Libro.Estado;
        this.bookForm.Precio = this.$route.params.Libro.Precio;
        this.bookForm.Existencias = this.$route.params.Libro.Existencias;
        this.bookForm.AnioPublicacion = this.$route.params.Libro.AnioPublicacion;
        this.bookForm.Sinopsis = this.$route.params.Libro.Sinopsis;
        console.log(this.bookForm.Genero, this.$route.params.Libro.Genero)

      } catch (error) {
        console.error('Error al buscar libros:', error);
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.txt-lg {
  font-size: 1.3rem;
}
</style>