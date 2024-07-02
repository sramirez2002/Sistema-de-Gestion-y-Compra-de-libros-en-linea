<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <div class="container-fluid p-5">
      <h1 class="text-center p-3" style="color: #230007;">Añadir libro</h1>
      <div class="container-fluid p-5">
        <div class="row">

          <div class="col-12 col-md-4 d-flex align-items-center justify-content-center text-center p-4">
            <img alt="image" :src="require('@/assets/book.png')" class="img-fluid mb-2" />
          </div>

          <div class="col-12 col-md-8">
            <div class="row">

              <!-- TÍTULO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="title" class="form-label txt-lg" style="color: #230007;">Título</label>
                <input v-model="userFormBook.Titulo" @blur="isFieldTouched.Titulo = true" type="text" id="title"
                  placeholder="Título" class="form-control" />
                <div v-if="!userFormBook.Titulo.trim() && isFieldTouched.Titulo" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- AUTOR -->
              <div class="col-12 col-md-6 mb-3">
                <label for="author" class="form-label txt-lg" style="color: #230007;">Autor </label>
                <input v-model="userFormBook.Autor" @blur="isFieldTouched.Autor = true" type="text" id="author"
                  placeholder="Autor" class="form-control" />
                <div v-if="!userFormBook.Autor.trim() && isFieldTouched.Autor" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- GÉNERO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="gender" class="form-label txt-lg" style="color: #230007;">Género</label>
                <select v-model="userFormBook.Genero" @blur="isFieldTouched.Genero = true" id="gender"
                  class="form-control">
                  <option disabled value="">Seleccione un género</option>
                  <option v-for="genero in generos" :key="genero.nombre" :value="genero.value">{{
                    genero.nombre }}</option>
                </select>
                <div v-if="!userFormBook.Genero && isFieldTouched.Genero" class="text-danger">Este campo es obligatorio.
                </div>
              </div>

              <!-- IDIOMA -->
              <div class="col-12 col-md-6 mb-3">
                <label for="Idioma" class="form-label txt-lg" style="color: #230007;">Idioma</label>
                <select v-model="userFormBook.listaIdiomas" @blur="isFieldTouched.Idioma = true" id="Idioma"
                  class="form-select">
                  <option value="" disabled selected>Seleccionar idioma</option>
                  <option v-for="idioma in listaIdiomas" :key="idioma.nombre" :value="idioma.nombre">{{ idioma.nombre }}
                  </option>
                </select>
                <div v-if="!userFormBook.listaIdiomas && isFieldTouched.listaIdiomas" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>


              <!-- EDITORIAL -->
              <div class="col-12 col-md-6 mb-3">
                <label for="editorial" class="form-label txt-lg" style="color: #230007;">Editorial</label>
                <input v-model="userFormBook.Editorial" @blur="isFieldTouched.Editorial = true" type="text"
                  id="editorial" placeholder="Editorial" class="form-control" />
                <div v-if="!userFormBook.Editorial.trim() && isFieldTouched.Editorial" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- NÚMERO DE PÁGINAS -->
              <div class="col-12 col-md-6 mb-3">
                <label for="numberpages" class="form-label txt-lg" style="color: #230007;">Número de páginas</label>
                <input v-model="userFormBook.Npages" @input="filterPages" @blur="isFieldTouched.Npages = true"
                  type="number" id="numberpages" placeholder="Número de páginas" class="form-control" min="1"
                  step="1" />
                <div v-if="!userFormBook.Npages && isFieldTouched.Npages" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- FECHA DE PUBLICACIÓN -->
              <div class="col-12 col-md-6 mb-3 ">
                <label for="publicationdate" class="form-label txt-lg" style="color: #230007;">Fecha de
                  publicación</label>
                <input v-model="userFormBook.FechaPublicacion" @blur="isFieldTouched.FechaPublicacion = true"
                  type="date" id="publicationdate" placeholder="DD/MM/YYYY" class="form-control" :min="getminDate()"
                  :max="getmaxDate()" @input="publicationyear()" />
                <div v-if="!userFormBook.FechaPublicacion && isFieldTouched.FechaPublicacion" class="text-danger">Este
                  campo es obligatorio.</div>
                <div v-if="FechaPublicacionError" class="text-danger">La fecha de publicación debe estar entre
                  {{ getminDate().slice(0, 4) }} y {{ getmaxDate().slice(0, 4) }}.</div>
              </div>

              <!-- AÑO DE PUBLICACIÓN -->
              <div class="col-12 col-md-6 mb-3">
                <label for="publicationyear" class="form-label txt-lg" style="color: #230007;">Año de
                  publicación</label>
                <input v-model="userFormBook.AnioPublicacion" @blur="isFieldTouched.AnioPublicacion = true"
                  type="number" id="publicationyear" placeholder="Año de publicación" class="form-control" min="1924"
                  max="2026" step="1" :disabled="true" />
              </div>

              <!-- ISSN -->
              <div class="col-12 col-md-6 mb-3">
                <label for="issn" class="form-label txt-lg" style="color: #230007;">ISSN</label>
                <input v-model.number="userFormBook.ISSN" @input="filterISSN" @blur="isFieldTouched.ISSN = true"
                  type="number" id="issn" placeholder="ISSN" class="form-control" min="1" step="1" />
                <div v-if="!userFormBook.ISSN && isFieldTouched.ISSN" class="text-danger">Este campo
                  es obligatorio.</div>
              </div>

              <!-- ESTADO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="Estado" class="form-label txt-lg" style="color: #230007;"> Estado </label>
                <select v-model="userFormBook.Estado" @blur="isFieldTouched.Estado = true" id="Estado"
                  class="form-control">
                  <option disabled value="">Seleccione el estado del libro</option>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                </select>
                <div v-if="!userFormBook.Estado.trim() && isFieldTouched.Estado" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- PRECIO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="Precio" class="form-label txt-lg" style="color: #230007;">Precio</label>
                <input v-model="userFormBook.Precio" @blur="isFieldTouched.Precio = true" type="number" id="Precio"
                  placeholder="Precio" class="form-control" min="1" step="1" @input="filterPrecio" />
                <div v-if="!userFormBook.Precio && isFieldTouched.Precio" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <div class="col-12 col-md-6 mb-3">
                <label for="Existencias" class="form-label txt-lg" style="color: #230007;">Existencias</label>
                <input v-model="userFormBook.Existencias" @blur="isFieldTouched.Existencias = true" type="number"
                  id="Existencias" placeholder="Existencias" class="form-control" min="1" max="500" step="1"
                  @input="filterExistentias" />
                <div v-if="!userFormBook.Existencias && isFieldTouched.Existencias" class="text-danger">Este
                  campo es obligatorio.</div>
              </div>
              <div class="col-12 col-md-8">
                <label for="title" class="form-label txt-lg" style="color: #230007;">Sinopsis</label>
                <textarea v-model="userFormBook.Sinopsis" @blur="isFieldTouched.Sinopsis = true" type="text" id="title"
                  placeholder="Sinopsis" class="form-control" />
                <div v-if="!userFormBook.Sinopsis.trim() && isFieldTouched.Sinopsis" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>
              <div class="col-12  col-md-4 text-center mt-5">
                <button type="button" @click="GenerarSinopsis()" class="TardisBoton"
                  :disabled="!(userFormBook.Autor && userFormBook.Titulo)">Generar Sinopsis</button>
              </div>
            </div>
            <div class="col-12 text-center mt-5">
                <button type="button" @click="AddBook" class="TardisBoton" :disabled="!isFormValid">Guardar
                  cambios</button>
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
import CargandoV from '@/components/CargandoV.vue';
import generos from '@/assets/generos.json';

export default {
  components: {
    ToolBar,
    CargandoV
  },
  name: 'AddBookView',
  data() {
    return {
      userFormBook: {
        listaIdiomas: [],
        Autor: '',
        ISSN: '',
        Titulo: '',
        Npages: '',
        FechaPublicacion: '',
        Editorial: '',
        Estado: '',
        Genero: '',
        AnioPublicacion: '',
        Precio: '',
        Existencias: '',
        Sinopsis: ''
      },
      isFieldTouched: {
        Titulo: false,
        Autor: false,
        Genero: false,
        Idioma: false,
        Editorial: false,
        Npages: false,
        FechaPublicacion: false,
        ISSN: false,
        Estado: false,
        Precio: false,
        Existencias: false,
        Sinopsis: false

      },
      backendUrl: '',
      AnioPublicacionError: false,
      FechaPublicacionError: false,
      name: 'AddBookView',
      loading: false,
    };
  },
  mounted() {
    this.fetchBackendUrl();
  },
  created() {
    this.cargarGeneros();
    this.cargarListaIdiomas();
  },

  computed: {
    isFormValid() {
      const textFieldsFilled = this.userFormBook.ISSN &&
        this.userFormBook.Editorial.trim() &&
        this.userFormBook.Npages &&
        this.userFormBook.Titulo.trim() &&
        this.userFormBook.listaIdiomas.trim() &&
        this.userFormBook.FechaPublicacion &&
        this.userFormBook.Genero &&
        this.userFormBook.Estado.trim() &&
        this.userFormBook.Precio &&
        this.userFormBook.Existencias &&
        this.userFormBook.Sinopsis.trim();

      const themesAreSelected = this.userFormBook.Precio > 0;

      return textFieldsFilled && themesAreSelected && !this.FechaPublicacionError;
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
      const input = this.userFormBook.FechaPublicacion;
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

      const input = this.filterNumber(this.userFormBook.Existencias);

      if (input > 500) {
        this.userFormBook.Existencias = input.toString().slice(0, 3);
      } else {
        this.userFormBook.Existencias = input;
      }
    },
    filterNumber(Value) {
      // Impide la entrada de caracteres que no sean dígitos
      const input = parseInt(Value.replace(/[D]/g, ''));
      console.clear();
      console.log(this.userFormBook.ISSN, typeof this.userFormBook.ISSN, Value, input);

      console.log(this.userFormBook.Existencias, input, Value);
      return input;
    },
    filterPages() {
      // Impide la entrada de caracteres que no sean dígitos
      let input = this.filterNumber(this.userFormBook.Npages);
      if (input === 0) {
        input = 1;
      }
      if (input > 99999) {
        this.userFormBook.Npages = input.toString().slice(0, 5);
      } else {
        this.userFormBook.Npages = input;
      }
    },
    filterPrecio() {
      // Impide la entrada de caracteres que no sean dígitos
      let input = this.filterNumber(this.userFormBook.Precio);
      if (input === 0) {
        input = 1;
      }
      if (input > 99999999) {
        this.userFormBook.Precio = input.toString().slice(0, 8);
      } else {
        this.userFormBook.Precio = input;
      }
    },
    filterISSN() {
      // Impide la entrada de caracteres que no sean dígitos

      let input = this.filterNumber(this.userFormBook.ISSN.toString());

      if (input > 9999999999) {
        this.userFormBook.ISSN = input.toString().slice(0, 10);
      } else {
        this.userFormBook.ISSN = input;
      }
    },
    /////////////////////Fin de seccion generica para filtrar campos de texto////////////////////////



    publicationyear() {
      this.filterFechaPublicacion();
      this.userFormBook.AnioPublicacion = this.userFormBook.FechaPublicacion.split('-')[0];
    },

    cargarListaIdiomas() {
      this.listaIdiomas = idiomas;
    },

    validateAnioPublicacion() {

      let AnioPublicacion = this.userFormBook.FechaPublicacion.substring(0, 4)
      if (AnioPublicacion !== this.userFormBook.AnioPublicacion && this.userFormBook.AnioPublicacion.trim() !== "") {
        this.AnioPublicacionError = true;
      }
      else {
        this.AnioPublicacionError = false;
      }
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
    async GenerarSinopsis() {
      this.loading = true;
      const headers = {
        'Action': 'GenerarSinopsis'
      };
      // Convierte en numero el ISSN
      const Body = {
        Titulo: this.userFormBook.Titulo,
        Autor: this.userFormBook.Autor,
      }
      try {
        const response = await axios.post(this.backendUrl, Body, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          this.userFormBook.Sinopsis = response.data.Data;
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
    async AddBook() {
      this.loading = true;

      // Check if all fields are touched before showing the alerts
      const allFieldsTouched = Object.values(this.isFieldTouched).every(touched => touched);

      if (!allFieldsTouched) {
        alert('Por favor, complete todos los campos antes de registrar.');
        this.loading = false;
        return;
      }

      if (!this.backendUrl) {
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        this.loading = false;
        return;
      }

      const headers = {
        'Action': 'AnadirLibro'
      };

      try {
        const response = await axios.post(this.backendUrl, this.userFormBook, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          alert("Registro exitoso: " + response.data.Data); // Muestra el mensaje de éxito
          this.$router.push('/search-book') // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error en el registro: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
        // Aquí podrías manejar errores específicos de la petición
        alert("Error al intentar registrar. Por favor, inténtalo de nuevo.");
      }
    }
  }
}
</script>

<style scoped>
.txt-lg {
  font-size: 1.3rem;
  /* You can adjust the value as needed */
}
</style>
