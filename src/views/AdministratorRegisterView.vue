<template>
  <div>
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <div class="fluid-container">
      <h1 class="text-center p-3" style="color: #230007;">Registro de Administradores</h1>

      <div class="container-fluid p-5">
        <div class="row">
          <div class="col-12 col-md-4 d-flex align-items-center justify-content-center text-center mb-3">
            <img alt="image" :src="require('@/assets/logoM.png')" class="img-fluid mb-2" />
          </div>
          <div class="col-12 col-md-8">
            <div class="row">


              <!-- CORREO ELECTRÓNICO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="email" class="form-label txt-lg" style="color: #230007;">Correo electrónico</label>
                <input v-model="userFormData.CorreoElectronico" @blur="isFieldTouched.CorreoElectronico = true" type="email"
                  id="email" placeholder="Email" class="form-control" />
                <div v-if="!isEmailValid && userFormData.CorreoElectronico && isFieldTouched.CorreoElectronico"
                  class="text-danger">Ingrese un correo electrónico válido.</div>
                <div v-if="!userFormData.CorreoElectronico.trim() && isFieldTouched.CorreoElectronico"
                  class="text-danger">Este campo es obligatorio.</div>
              </div>

              <!-- USUARIO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="user" class="form-label txt-lg" style="color: #230007;">Usuario </label>
                <input v-model="userFormData.Username" @blur="isFieldTouched.Username = true" required type="user" id="user"
                  placeholder="Usuario" class="form-control"  @input="validateInput('Username')"/>
                <div v-if="!userFormData.Username.trim() && isFieldTouched.Username" class="text-danger">Este campo es
                  obligatorio.</div>
                <div v-if="usernameError" class="text-danger">Solo caracteres alfanuméricos.</div>
              </div>

              <!-- BOTÓN DE REGISTRO -->
              <div class="col-12 col-md-6 d-flex align-items-center justify-content-center mx-auto">
                <button type="button" @click="validateAndRegister" class="TardisBoton"
                  :disabled="!isFormValid">Registrar administrador</button>
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
import axios from 'axios'; // Asegúrate de instalar axios con `npm install axios` o `yarn add axios`
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';

export default {
  components: {
    ToolBar,
    CargandoV
  },
  created() {
    this.fetchBackendUrl();
  },
  name: 'AdministratorRegisterView',
  data() {
    return {
      name: 'AdministratorRegisterView',
      userFormData: {
        Username: '',
        CorreoElectronico: '',
        backendUrl: '',
        Tipo: 'Administrador' // Asumiendo que todos los nuevos registros son de tipo 'Administrador'
      },
      usernameError: false,
      passwordError: false,
      showPassword: false,
      isFieldTouched: {
        CorreoElectronico: false,
        Username: false
      },
      loading: false
    }
  },
  computed: {
    isEmailValid() {
      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailPattern.test(this.userFormData.CorreoElectronico);
    },
    isFormValid() {
      const textFieldsFilled =
        this.userFormData.CorreoElectronico.trim() &&
        !this.usernameError &&
        this.isEmailValid &&
        this.userFormData.Username.trim();
      return textFieldsFilled;
    }
  },
  methods: {
    fetchBackendUrl() {
      console.log('Backend URL:', this.backendUrl);
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
      if (field === 'Username') {
        this.userFormData.Username = this.userFormData.Username.slice(0, 20);
        if (/[^a-zA-Z0-9]/.test(this.userFormData.Username)) {
          this.usernameError = true; // Establece el estado de error para Username
          this.userFormData.Username = this.userFormData.Username.replace(/[^a-zA-Z0-9]/g, '');
        } else {
          this.usernameError = false; // Limpia el estado de error si el input es válido
        }
      } else if (field === 'Password') {
        if (/[^a-zA-Z0-9]/.test(this.userFormData.Password)) {
          this.passwordError = true; // Establece el estado de error para Password
          this.userFormData.Password = this.userFormData.Password.replace(/[^a-zA-Z0-9]/g, '');
        } else {
          this.passwordError = false; // Limpia el estado de error si el input es válido
        }
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    touchField(field) {
      // Set the flag to true when the field is touched
      this.isFieldTouched[field] = true;
    },
    filterDNI(event) {
      // Impide la entrada de caracteres que no sean dígitos
      const value = parseInt(event.target.value, 10);
      if (isNaN(value) || value < 0) {
        // Restablece el valor a un estado válido o lo deja en blanco si no es un número
        this.userFormData.DNI = '';
      } else {
        this.userFormData.DNI = value;
      }
    },
    getCurrentDate() {
      const today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
      const year = today.getFullYear();

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

    async validateAndRegister() {

      this.loading = true;
      // Check if all fields are touched before showing the alerts
      const allFieldsTouched = Object.values(this.isFieldTouched).every(touched => touched);

      if (!allFieldsTouched) {
        this.loading = false;
        alert('Por favor, complete todos los campos antes de registrar.');
        return;
      }

      if (!this.backendUrl) {
        this.loading = false;
        alert('La URL del backend no está disponible. Intente nuevamente.');
        return;
      }

      const headers = {
        'Action': 'SingInAdmin', // Asegúrate de que esta cabecera sea aceptada y manejada en tu backend
        'Content-Type': 'application/json'
      };

      try {
        const response = await axios.post(this.backendUrl, this.userFormData, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          alert("Registro exitoso: " + response.data.Data); // Muestra el mensaje de éxito
          this.$router.go(); // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error en el registro: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        this.loading = false;
        console.error(error); // Aquí podrías manejar errores específicos de la petición
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
