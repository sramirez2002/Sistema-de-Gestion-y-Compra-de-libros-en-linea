<template>
  <div>
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->

    <!-- MAIN CONTAINER -->

    <div class="container text-center p-5">
      <img :src="require('@/assets/logoM.png')" alt="logo" width="280">
      <h1 class="p-3" style="color: #230007;">Cambiar contraseña</h1>
      <div class="vstack gap-2 col-md-5 mx-auto mt-3 mb-3 ">
        <div class="form-group mt-3 mb-3">

          <label for="confirmationcode" class="form-label" style="color: #230007;">Código de confirmación</label>
          <input v-model="PasswordFormData.Codigo" type="text" id="confirmationcode"
            placeholder="Codigo de confirmación" class="form-control" @input="ValidCode" />

          <label for="newpassword" class="form-label pt-3" style="color: #230007;">Contraseña nueva</label>
          <input v-model="PasswordFormData.Password" type="password" id="newpassword" placeholder="Contraseña nueva"
            class="form-control" required @input="ValidatePassword()" />
          <div>
            <ul class="password-rules-list">
              <li v-html="ValidesContrasenia()"></li>
            </ul>
          </div>
          <label for="confirmationpassword" class="form-label pt-4" style="color: #230007;"> Confirmar
            contraseña</label>
          <input v-model="PasswordFormData.Confirmation" type="password" id="confirmationpassword"
            placeholder="Confirmar contraseña" class="form-control" required @input="ValidatePassword()" />
        </div>
        <div>
          <p v-if="PasswordError" class="error-message" style="color: crimson;">Solo caracteres alfanuméricos
            permitidos.</p>
          <p v-if="ConfirmationError" class="error-message" style="color: crimson;">Las contraseñas no coinciden.</p>
        </div>

        <div class="text-center ">
          <button @click="ChangePassword" :disabled="botonDeshabilitado" type="button"
            class="TardisBoton">Cambiar contraseña</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';

export default {
  components: {
    ToolBar
  },
  name: 'ChangePassword',
  data() {
    return {
      name: 'ChangePassword',
      PasswordError: false,
      ConfirmationError: false,
      botonDeshabilitado: true,
      backendUrl: '',
      PasswordFormData: {
        Password: '',
        Codigo: '',
        Confirmation: ''
      },
      PasswordFromatError: false,
      loading: false
    };
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
          alert('No se pudo obtener la URL del backend. Intente nuevamente.');
        });
    },
    ValidCode() {
      this.PasswordFormData.Codigo = this.PasswordFormData.Codigo.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8);
    },
    ValidesContrasenia() {
      let Texto = "<ul>";
      if (this.PasswordFormData.Password.length < 8) {
        Texto = Texto + "<li>❌ Minimo 8 caracteres</li>";
      }
      else {
        Texto = Texto + "<li>✅ Minimo 8 caracteres</li>";
      }
      if (this.PasswordFormData.Password.search(/[a-z]/i) < 0) {
        Texto = Texto + "<li>❌ Al menos una letra</li>";
      }
      else {
        Texto = Texto + "<li>✅ Al menos una letra</li>";
      }
      if (this.PasswordFormData.Password.search(/[A-Z]/) < 0) {
        Texto = Texto + "<li>❌ Al menos una letra mayúscula</li>";
      }
      else {
        Texto = Texto + "<li>✅ Al menos una letra mayúscula</li>";
      }
      if (this.PasswordFormData.Password.search(/[0-9]/) < 0) {
        Texto = Texto + "<li>❌ Al menos un número</li>";
      }
      else {
        Texto = Texto + "<li>✅ Al menos un número</li>";
      }
      Texto += "</ul>";

      //Revisa si ❌ esta en el texto
      if (Texto.includes("❌")) {
        this.PasswordFromatError = true;
      }
      else {
        this.PasswordFromatError = false;
      }
      return Texto;
    },
    ValidatePassword() {
      this.PasswordError = false;
      this.ConfirmationError = false;
      if (/[^a-zA-Z0-9]/.test(this.PasswordFormData.Password)) {
        this.PasswordError = true;
      }
      if (this.PasswordFormData.Password !== this.PasswordFormData.Confirmation) {
        this.ConfirmationError = true;
      }

      this.botonDeshabilitado = !(this.PasswordFormData.Password &&
        this.PasswordFormData.Codigo &&
        this.PasswordFormData.Password === this.PasswordFormData.Confirmation &&
        !this.PasswordError && !this.ConfirmationError && !this.PasswordFromatError);
    },

    async ChangePassword() {
      if (!this.backendUrl) {
        alert('La URL del backend no está disponible. Intente nuevamente.');
        return;
      }
      const headers = {
        'Action': 'ChangePassword',
        'Content-Type': 'application/json'
      };

      try {
        const response = await axios.post(this.backendUrl, this.PasswordFormData, { headers });
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          alert("Cambio exitoso: " + response.data.Data); // Muestra el mensaje de éxito
          this.$router.push('/login')
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error : " + response.data.Data); // Muestra mensaje de error
        }

        // Manejar la respuesta exitosamente aquí
      } catch (error) {
        console.error(error);
        alert('Error al conectar con el backend. Intente nuevamente.');
        // Manejar el error aquí
      }
    }
  }
}
</script>

<style scoped>


.password-rules-list {
  list-style-type: none;
  /* Elimina el punto de inicio */
  padding-left: 0;
  /* Elimina el relleno izquierdo predeterminado */
}

.password-rules-list li {
  text-align: left;
  /* Alinea el texto a la izquierda */

}
</style>