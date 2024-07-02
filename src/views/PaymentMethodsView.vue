<template>
  <div>
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->

    <div class="container mt-4">
      <h2>Métodos de Pago</h2>
      <div class="row mb-3">
        <div v-for="card in cards" :key="card.cardNumber" class="col-md-6 mb-3">
          <div class="card mb-3 custom-card" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-4">
                <img :src="require('@/assets/credit-card.png')" class="img-fluid rounded-start custom-img"
                  alt="Imagen de tarjeta de crédito">
              </div>
              <div class="col-md-8 d-flex flex-column justify-content-between">
                <div class="card-body">
                  <h5 class="card-title">{{ card.name }}</h5>
                  <p class="card-text">Número: {{ "**** **** **** " + card.cardNumber.slice(-4) }}</p>
                </div>
                <div class="card-footer text-center">
                  <button @click="removeCard(card.cardNumber)" class="btn delete-button">
                    <span class="material-symbols-outlined delete-icon">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-link to="/credit-card" class="TardisBoton" style="text-decoration: none;">Agregar Método de
        Pago</router-link>
    </div>
    <!-- Cargamdo -->
    <CargandoV :Show="loading" />
    <!--Fin Cargamdo -->
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue'; // Ajusta la ruta según la ubicación de tu componente
import axios from 'axios';
import CargandoV from '@/components/CargandoV.vue';
export default {
  name: 'PaymentMethodsView',
  components: {
    ToolBar,
    CargandoV
  },
  data() {
    return {
      name: 'PaymentMethodsView', // Nombre de la vista para pasar al Toolbar
      cards: [],
      backendUrl: '',
      loading: false
    };
  },
  created() {
    this.loadCards();
  },

  mounted() {
    this.fetchBackendUrl();
  },
  methods: {
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
    loadCards() {
      const userData = JSON.parse(localStorage.getItem('UserData'));
      if (userData && userData.MetodosPago) {
        this.cards = userData.MetodosPago;
      }
    },

    async removeCard(cardNumber) {
      this.cards = this.cards.filter(card => card.cardNumber !== cardNumber);
      let Auxiliar = JSON.parse(localStorage.UserData);
      Auxiliar.MetodosPago = this.cards;
      this.loading = true;
      if (!this.backendUrl) {
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        this.fetchBackendUrl();
        return;
      }
      const headers = {
        'Action': 'ActualizarUsuarios',
        'Content-Type': 'application/json'
      };

      try {
        const response = await axios.post(this.backendUrl, Auxiliar, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend

          localStorage.UserData = JSON.stringify(Auxiliar);
          this.loading = false;
          alert("Tarjeta eliminada exitosamente: " + response.data.Data); // Muestra el mensaje de éxito
          // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error en la edicion: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        console.error(error);
        // Aquí podrías manejar errores específicos de la petición
        this.loading = false;
        alert("Error al intentar editar. Por favor, inténtalo de nuevo.");
      }
    }
  }
};
</script>

<style scoped>
* {
  color: #230007;
  /* Aplicar color de letra a todos los elementos */
}

.custom-card {
  border-radius: 10px;
  /* Bordes redondeados */
}

.custom-img {
  margin-left: 20px;
  /* Mover la imagen 20px a la derecha */
}

.custom-button {
  background-color: #230007;
  /* Color de fondo del botón */
  border-color: #230007;
  /* Color del borde del botón */
}

.custom-button:hover {
  background-color: darken(#230007, 10%);
  /* Color de fondo del botón al pasar el cursor */
  border-color: darken(#230007, 10%);
  /* Color del borde del botón al pasar el cursor */
}


.delete-button {
  background-color: #ffffff;
  /* Color de fondo del botón */
  border-color: #230007;
  /* Color del borde del botón */
  color: #ffffff;
  /* Color del texto */
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
