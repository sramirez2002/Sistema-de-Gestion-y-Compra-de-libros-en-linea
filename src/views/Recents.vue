<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <div class="container mt-4">
      <h1 class="text-center mb-4" style="color: #230007;">Libros Recientes</h1>
      <ul v-if="books.length > 0" class="mt-3 list-unstyled">
        <li v-for="libro in books" :key="libro.ISSN">
          <ResultBook :libro="libro" />
        </li>
      </ul>
      <div v-else>
        <p class="text-center">No hay libros recientes para mostrar.</p>
      </div>
    </div>
    <!-- Cargamdo -->
    <CargandoV :Show="loading" />
    <!--Fin Cargamdo -->
  </div>
</template>

<script>
import axios from 'axios';
import ResultBook from '@/components/ResultBook.vue';
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';

export default {
  components: {
    ToolBar,
    ResultBook,
    CargandoV // Registra el componente ResultBook
  },
  name: 'RecentBooksView',
  data() {
    return {
      books: [],
      name: 'RecentBooksView',
      loading: false
    };
  },
  methods: {
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

    async fetchRecentBooks() {
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 1000)); // espera hasta tener la url del back


      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }

      const headers = {
        'Action': 'GetNewBooks'
      };

      try {
        const response = await axios.post(this.backendUrl, {}, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          this.loading = false;
          this.books = response.data.Data;
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
    this.fetchRecentBooks();
  }
}
</script>

<style scoped>
/* Estilos adicionales según sea necesario */
</style>