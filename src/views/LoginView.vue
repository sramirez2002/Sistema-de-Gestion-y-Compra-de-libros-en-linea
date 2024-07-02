<template>
  <div>
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->

    <!-- MAIN CONTAINER -->
    <div class="container-fluid text-center p-5">
      <img :src="require('@/assets/logoM.png')" alt="logo" width="280">
      <h1 class="p-3 text" style="color: #230007;">Inicio de sesión</h1>
      <div class="vstack gap-2 col-md-5 mx-auto mt-3 mb-3">
        <form @submit.prevent="login">
          <div class="form-group mt-3 mb-3">
            <input type="text" placeholder="Usuario" class="form-control me-2" v-model="username" required
              @input="validateInput('username')">
            <p v-if="usernameError" class="error-message">Solo caracteres alfanuméricos permitidos.</p>

          </div>
          <div class="form-group mt-3 mb-3">
            <input type="password" placeholder="Contraseña" class="form-control me-2" v-model="password" required
              @input="validateInput('password')">
            <p v-if="passwordError" class="error-message">Solo caracteres alfanuméricos permitidos.</p>
          </div>
          <button type="submit" class="TardisBoton">Iniciar sesión</button>
        </form>
        <p><router-link to="/send-confirmation"
            class="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            style="color: #230007;">¿Olvidaste tu contraseña?</router-link></p>
      </div>
      <!-- Cargamdo -->
      <CargandoV :Show="loading" />
      <!--Fin Cargamdo -->
    </div>
    <!-- END MAIN CONTAINER -->
  </div>
</template>

<script>
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';

export default {
  components: {
    ToolBar,
    CargandoV
  },
  name: 'LoginView',
  data() {
    return {
      name: 'LoginView',
      username: '',
      password: '',
      usernameError: false,
      passwordError: false,
      backendUrl: '',
      loading: false,
    };
  },
  created() {
    if (localStorage.UserData === undefined) {
      localStorage.UserData = JSON.stringify({ "Tipo": "Visitante" })
    }
    else if (JSON.parse(localStorage.UserData).Tipo == "Visitante") {
      localStorage.UserData = JSON.stringify({ "Tipo": "Visitante" })
    }
    else {
      this.$router.push('/search-book');
    }
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
          console.error('Error fetching backend URL:', error);
          alert('No se pudo obtener la configuración del servidor. Por favor, intente más tarde.');
        });
    },
    validateInput(field) {
      // Reset error states
      this.usernameError = false;
      this.passwordError = false;

      if (field === 'username') {
        if (/[^a-zA-Z0-9]/.test(this.username)) {
          this.usernameError = true;
        }
        this.username = this.username.replace(/[^a-zA-Z0-9]/g, '');
      } else if (field === 'password') {
        if (/[^a-zA-Z0-9]/.test(this.password)) {
          this.passwordError = true;
        }
        this.password = this.password.replace(/[^a-zA-Z0-9]/g, '');
      }
    },
    login() {
      this.loading = true;
      if (!this.backendUrl) {
        alert('La URL del backend no está disponible. Intente nuevamente.');
        this.loading = false;
        return;
      }
      axios.post(this.backendUrl,
        {
          Username: this.username,
          Password: this.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Action': 'Login',
          },
        }
      )
        .then((response) => {
          if (response.data.Status === "True") { // Asegúrate de que esta condición coincida con cómo tu backend envía la respuesta
            // Aquí puedes añadir la lógica de redirección según el tipo de usuario
            localStorage.UserData = JSON.stringify(response.data.UserData);
            const userData = response.data.UserData;
            this.loading = false;
            if (response.data.Tipo === "Root") {
              alert("Acceso concedido Root."); // Mensaje de éxito
              this.$router.push('/administrator-register'); // Redirigir al usuario a RootView
            } else if (response.data.Tipo === "Admin") {
              alert("Acceso concedido Admin.");
              this.$router.push({ name: 'search-book', params: { UserData: userData } }); // Redirigir al usuario a AdminView
            } else {
              this.$router.push({ name: 'search-book', params: { UserData: userData } }); // Redirigir al usuario a AboutView o cualquier otra vista según sea adecuado
            }
          } else {
            this.loading = false;
            alert("Error: " + response.data.Data); // Mensaje de error
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
          alert("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo."); // Manejo del error
        });
    },
  },
};
</script>

<style scoped>
.login-container {
  width: 100%;
  display: flex;
  overflow: auto;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: #D9D9D9;
}

.login-container1 {
  top: 227px;
  left: 612px;
  width: 400px;
  height: 515px;
  display: flex;
  position: absolute;
  align-items: flex-end;
  border-color: var(--dl-color-gray-black);
  border-width: 1px;
  justify-content: center;
  background-color: #ffffff;
}

.login-text {
  top: 20px;
  right: 140px;
  margin: auto;
  position: absolute;
  align-self: center;
}

.login-textinput {
  top: 240px;
  right: 72px;
  position: absolute;
}

.login-textinput1 {
  top: 310px;
  right: 72px;
  position: absolute;
}

.login-button {
  left: 158px;
  bottom: 100px;
  position: absolute;
}

.login-image {
  top: 226px;
  left: 74px;
  width: 512px;
  position: absolute;
  align-self: flex-start;
  object-fit: cover;
}

.error-message {
  color: red;
  font-size: 0.8em;
}
</style>
