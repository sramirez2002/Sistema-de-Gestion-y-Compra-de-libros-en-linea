<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <div class="container-fluid p-5">
      <h1 class="text-center p-3" style="color: #230007;">Editar Perfil</h1>
      <div class="container-fluid p-5">
        <div class="row">

          <div class="col-12 col-md-4 d-flex align-items-center justify-content-center text-center mb-3">
            <img alt="image" :src="require('@/assets/logoM.png')" class="img-fluid mb-2" />
          </div>
          <div class="col-12 col-md-8">
            <div class="row">

              <!-- NOMBRES -->
              <div class="col-12 col-md-6 mb-3">
                <label for="firstname" class="form-label txt-lg" style="color: #230007;">Nombres</label>
                <input v-model="userFormData.Nombres" @blur="isFieldTouched.Nombres = true" type="text" id="firstname"
                  placeholder="Nombres" class="form-control" />
                <div v-if="!userFormData.Nombres.trim() " class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- APELLIDOS -->
              <div class="col-12 col-md-6 mb-3">
                <label for="lastname" class="form-label txt-lg" style="color: #230007;">Apellidos</label>
                <input v-model="userFormData.Apellidos" @blur="isFieldTouched.Apellidos = true" type="text"
                  id="lastname" placeholder="Apellidos" class="form-control" />
                <div v-if="!userFormData.Apellidos.trim() " class="text-danger">Este campo es
                  obligatorio.</div>
              </div>

              <!-- DNI -->
              <div class="col-12 col-md-6 mb-3">
                <label for="dni" class="form-label txt-lg" style="color: #230007;">DNI</label>
                <input v-model.number="userFormData.DNI" @input="filterDNI" @blur="isFieldTouched.DNI = true"
                  type="number" id="dni" placeholder="DNI" class="form-control" min="0" step="1" />
                <div v-if="!userFormData.DNI.toString().trim() " class="text-danger">Este campo es
                  obligatorio.</div>
                <div v-if="dniError" class="text-danger">Ingrese un DNI válido.</div>
              </div>

              <!-- CORREO ELECTRONICO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="email" class="form-label txt-lg" style="color: #230007;">Correo electrónico</label>
                <input v-model="userFormData.CorreoElectronico" @blur="isFieldTouched.CorreoElectronico = true"
                  type="email" id="email" placeholder="Email" class="form-control" />
                <div v-if="!isEmailValid "
                  class="text-danger">
                  Ingrese un correo electrónico válido.
                </div>
              </div>

              <!-- FECHA de nacimiento -->
              <div class="col-12 col-md-6 mb-3 ">
                <div class="fluid-container">
                  <label for="birthdate" class="form-label txt-lg" style="color: #230007;">Fecha de nacimiento</label>
                  <input v-model="userFormData.FechaNacimiento" @blur="isFieldTouched.FechaNacimiento = true"
                    type="date" id="birthdate" placeholder="DD/MM/YYYY" class="form-control" :min="getminDate()"
                    :max="getMaxDate()" @input="filterFecha" />
                  <div v-if="!userFormData.FechaNacimiento.trim() "
                    class="text-danger">Este campo es obligatorio.</div>
                  <div v-if="FechaNacimientoError" class="text-danger">Demaciado joven, vuelve en unos años</div>
                </div>
              </div>

              <!-- LUGAR de residencia -->
              <div class="col-12 col-md-6 mb-3">
                <label for="birthplace" class="form-label txt-lg" style="color: #230007;">Lugar de residencia</label>
                <select v-model="userFormData.PaisNacimiento" @blur="isFieldTouched.PaisNacimiento = true"
                  id="birthplacecountry" class="form-select"
                  @change="ResetCountry = true; userFormData.CiudadNacimiento = ''; userFormData.EstadoNacimiento = ''">
                  <option value="" disabled selected>Seleccionar Pais</option>
                  <option v-for="Pais in listaPaises" :key="Pais.CountryId" :value="Pais.CountryId">{{ Pais.name }}
                  </option>
                </select>
                <div v-if="!userFormData.PaisNacimiento " class="text-danger">Este campo
                  es
                  obligatorio.</div>
              </div>
              <!-- v-if="userFormData.PaisNacimiento" -->
              <div class="col-12 col-md-6 mb-3">
                <label for="birthplace" class="form-label txt-lg" style="color: #230007;">Estado de residencia</label>
                <select v-model="userFormData.EstadoNacimiento" @blur="isFieldTouched.EstadoNacimiento = true"
                  id="birthplacestate" class="form-select"
                  @change="ResetCountry = false; userFormData.CiudadNacimiento = ''">
                  <option value="" disabled selected>Seleccionar Estado</option>
                  <option v-for="Estado in listaEstado[userFormData.PaisNacimiento]" :key="Estado.StateId"
                    :value="Estado.StateId">{{ Estado.name }}</option>
                </select>
                <div v-if="!userFormData.EstadoNacimiento " class="text-danger">Este
                  campo es
                  obligatorio.</div>
              </div>
              <!-- v-if="userFormData.EstadoNacimiento && !ResetCountry" -->
              <div class="col-12 col-md-6 mb-3">
                <label for="birthplace" class="form-label txt-lg" style="color: #230007;">Ciudad de residencia</label>
                <select v-model="userFormData.CiudadNacimiento" @blur="isFieldTouched.CiudadNacimiento = true"
                  id="birthplacecirty" class="form-select">
                  <option value="" disabled selected>Seleccionar Ciudad</option>
                  <option v-for="Ciudad in listaCiudades[userFormData.EstadoNacimiento]" :key="Ciudad.id"
                    :value="Ciudad.id">{{ Ciudad.name }}</option>
                </select>
                <div v-if="!userFormData.CiudadNacimiento " class="text-danger">Este
                  campo es
                  obligatorio.</div>
              </div>



              <!-- GÉNERO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="gender" class="form-label txt-lg" style="color: #230007;">Género</label>
                <select v-model="userFormData.Genero" @blur="isFieldTouched.Genero = true" id="gender"
                  class="form-control">
                  <option disabled value="">Seleccione un género</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="No especifica">No especifica</option>
                </select>
                <div v-if="!userFormData.Genero " class="text-danger">Este campo es obligatorio.
                </div>
              </div>

              <!-- DIRECCIÓN DE CORRESPONDENCIA -->
              <div class="col-12 col-md-6 mb-3">
                <label for="address" class="form-label txt-lg" style="color: #230007;">Dirección de correspondencia
                </label>
                <input v-model="userFormData.DireccionCorrespondencia"
                  @blur="isFieldTouched.DireccionCorrespondencia = true" type="address" id="address"
                  placeholder="Dirección de correspondencia" class="form-control" />
                <div v-if="!userFormData.DireccionCorrespondencia.trim() "
                  class="text-danger">Este campo es obligatorio.</div>
              </div>

              <!-- USUARIO -->
              <div class="col-12 col-md-6 mb-3">
                <label for="user" class="form-label txt-lg" style="color: #230007;">Usuario </label>
                <input v-model="userFormData.Username" required @input="validateInput('Username')"
                  @blur="isFieldTouched.Username = true" type="text" id="user" placeholder="Usuario"
                  class="form-control" />

                <div v-if="!userFormData.Username.trim() " class="text-danger">Este campo es
                  obligatorio.</div>
                <div v-if="usernameError" class="text-danger">Solo se permiten caracteres alfanuméricos.</div>
              </div>
              <!-- PREFERENCIAS -->
              <label for="themes" class="form-label txt-lg" style="color: #230007;">Temas literarios de
                preferencia </label>

              <div v-for="genero in generos" :key="genero.value" class="col-6 col-md-2 text-left">
                <label>
                  <input type="checkbox" :id="genero.value" :value="genero.value"
                    v-model="userFormData.TemasLiterariosPreferencia" class="form-check-input">
                  {{ genero.nombre }}
                </label>
              </div>
              <div class="col-12 text-center mb-3">
                <div v-if="!userFormData.TemasLiterariosPreferencia.length" class="text-danger">Este campo es
                  obligatorio.</div>
              </div>
              <!-- CONTRASEÑA -->
              <div class="col-12 col-md-6 mb-3">
                <label for="password" class="form-label txt-lg" style="color: #230007;">Contraseña</label>
                <div class="input-group">
                  <input :type="showPassword ? 'text' : 'password'" v-model="userFormData.Password" required
                    @blur="isFieldTouched.Password = true" @input="validateInput('Password')" id="password"
                    placeholder="Contraseña" class="form-control" />
                </div>
                <div v-if="!userFormData.Password.trim() " class="text-danger">Este campo es
                  obligatorio</div>
                <div>
                  <ul class="password-rules-list">
                    <li v-html="ValidesContrasenia()"></li>
                  </ul>
                </div>
              </div>


              <!-- CONFIRMAR CONTRASEÑA -->
              <div class="col-12 col-md-6 mb-3">
                <label for="password" class="form-label txt-lg" style="color: #230007;">Confirmar contraseña</label>
                <div class="input-group">
                  <input :type="showPassword ? 'text' : 'password'" v-model="PasswordConfirm" required
                    @input="validateInput('PasswordConfirm')" @blur="isFieldTouched.PasswordConfirm = true"
                    id="password" placeholder="Confirmar contraseña" class="form-control" />
                </div>
                <div v-if="!PasswordConfirm.trim() " class="text-danger">Este campo es
                  obligatorio.</div>
                <div
                  v-if="userFormData.Password !== PasswordConfirm && PasswordConfirm.trim() "
                  class="text-danger">Las contraseñas no coinciden.</div>
              </div>


            </div>
            <button type="button" @click="registerUser" class="TardisBoton" :disabled="!isFormValid()">Guardar</button>
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
import Paises from '@/assets/Pais-dep-ciu/countries.json';
import Estados from '@/assets/Pais-dep-ciu/states.json';
import Ciudades from '@/assets/Pais-dep-ciu/cities.json';
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';
import generos from '@/assets/generos.json';

export default {
  components: {
    ToolBar,
    CargandoV
  },
  name: 'ClienteEditView',
  data() {
    return {
      userFormData: {
        Password: '',
        Username: '',
        DNI: '',
        Nombres: '',
        Apellidos: '',
        FechaNacimiento: '',
        PaisNacimiento: '',
        EstadoNacimiento: '',
        CiudadNacimiento: '',
        DireccionCorrespondencia: '',
        Genero: '',
        CorreoElectronico: '',
        TemasLiterariosPreferencia: [],
        Tipo: 'Cliente'
      },
      backendUrl: '',
      ResetCountry: false,
      isFieldTouched: {
        Password: false,
        PasswordConfirm: false,
        Username: false,
        DNI: false,
        Nombres: false,
        Apellidos: false,
        FechaNacimiento: false,
        PaisNacimiento: false,
        EstadoNacimiento: false,
        CiudadNacimiento: false,
        DireccionCorrespondencia: false,
        Genero: false,
        CorreoElectronico: false,
        TemasLiterariosPreferencia: false
      },
      PasswordConfirm: '',
      usernameError: false,
      passwordError: false,
      showPassword: false,
      dniError: false,
      FechaNacimientoError: false,
      name: 'ClienteEditView',
      loading: false,
      checkedGeneros: ['autoayuda']
    };
  },
  mounted() {
    this.fetchBackendUrl();
  },
  created() {
    this.cargarGeneros();
    this.cargarListaPaisesEstadosCiudades();
    this.loadUserData();
  },
  computed: {
    isEmailValid() {
      const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailPattern.test(this.userFormData.CorreoElectronico);
    }

  },
  methods: {
    loadUserData() {
      const userData = JSON.parse(localStorage.UserData);
      this.userFormData.CorreoElectronico = userData.CorreoElectronico || '';
      this.userFormData.Username = userData.Username || '';
      this.PasswordConfirm = userData.Password || '';
      this.userFormData.Password = userData.Password || '';
      this.userFormData.DNI = userData.DNI || '';
      this.userFormData.Nombres = userData.Nombres || '';
      this.userFormData.Apellidos = userData.Apellidos || '';
      this.userFormData.FechaNacimiento = userData.FechaNacimiento || '';
      this.userFormData.PaisNacimiento = userData.PaisNacimiento || '';
      this.userFormData.EstadoNacimiento = userData.EstadoNacimiento || '';
      this.userFormData.CiudadNacimiento = userData.CiudadNacimiento || '';
      this.userFormData.Genero = userData.Genero || '';
      this.userFormData.DireccionCorrespondencia = userData.DireccionCorrespondencia || '';
      this.userFormData.TemasLiterariosPreferencia = userData.TemasLiterariosPreferencia || [];
    },
    filterUsername() {
      // Impide la entrada de caracteres que no sean alfanuméricos
      this.userFormData.Username = this.userFormData.Username.replace(/[^a-zA-Z0-9]/g, '');
    },
    ValidesContrasenia() {
      let Texto = "<ul>";
      if (this.userFormData.Password.length < 8) {
        Texto = Texto + "<li>❌ Minimo 8 caracteres</li>";
      }
      else {
        Texto = Texto + "<li>✅ Minimo 8 caracteres</li>";
      }
      if (this.userFormData.Password.search(/[a-z]/i) < 0) {
        Texto = Texto + "<li>❌ Al menos una letra</li>";
      }
      else {
        Texto = Texto + "<li>✅ Al menos una letra</li>";
      }
      if (this.userFormData.Password.search(/[A-Z]/) < 0) {
        Texto = Texto + "<li>❌ Al menos una letra mayúscula</li>";
      }
      else {
        Texto = Texto + "<li>✅ Al menos una letra mayúscula</li>";
      }
      if (this.userFormData.Password.search(/[0-9]/) < 0) {
        Texto = Texto + "<li>❌ Al menos un número</li>";
      }
      else {
        Texto = Texto + "<li>✅ Al menos un número</li>";
      }
      Texto += "</ul>";

      //Revisa si ❌ esta en el texto
      if (Texto.includes("❌")) {
        this.passwordError = true;
      }
      else {
        this.passwordError = false;
      }
      return Texto;
    },

    filterFecha() {
      const maxYear = this.getMaxDate().slice(0, 4);
      const minYear = this.getminDate().slice(0, 4);
      // Impide la entrada de caracteres que no sean dígitos
      const input = this.userFormData.FechaNacimiento;
      if (input !== '') {
        if (!(input.toString().slice(0, 4) <= maxYear && input.toString().slice(0, 4) >= minYear)) {
          this.FechaNacimientoError = true;
        }
        else {
          this.FechaNacimientoError = false;
        }
      }
    },
    isFormValid() {
      const textFieldsFilled = this.userFormData.DNI > 0 &&
        (this.userFormData.PaisNacimiento.trim() !== '') &&
        (this.userFormData.EstadoNacimiento.trim() !== '') &&
        (this.userFormData.CiudadNacimiento.trim() !== '') &&
        this.userFormData.FechaNacimiento &&
        this.userFormData.Apellidos.trim() &&
        this.userFormData.Nombres.trim() &&
        this.userFormData.Genero.trim() &&
        this.isEmailValid && // Usa la propiedad computada aquí
        this.userFormData.Username.trim() &&
        this.userFormData.Password.trim() &&
        this.userFormData.DireccionCorrespondencia.trim() &&
        this.PasswordConfirm.trim() &&
        this.userFormData.TemasLiterariosPreferencia.length > 0 &&
        !this.usernameError &&
        !this.passwordError &&
        !this.FechaNacimientoError &&
        !this.dniError &&
        this.userFormData.Password === this.PasswordConfirm;




      return textFieldsFilled;
    },

    cargarGeneros() {
      this.generos = generos;
    },
    cargarListaPaisesEstadosCiudades() {
      this.listaPaises = Paises;
      this.listaEstado = Estados;
      this.listaCiudades = Ciudades;
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
    validateInput(field) {
      if (field === 'Username') {

        this.userFormData.Username = this.userFormData.Username.slice(0, 20);
        if (/[^a-zA-Z0-9]/.test(this.userFormData.Username)) {
          this.usernameError = true; // Establece el estado de error para Username
        } else {
          this.usernameError = false; // Limpia el estado de error si el input es válido
        }
      } else if (field === 'Password' || field === 'PasswordConfirm') {
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
    filterDNI() {
      // Impide la entrada de caracteres que no sean dígitos

      let input = this.filterNumber(this.userFormData.DNI.toString());

      if (input > 9999999999) {
        this.userFormData.DNI = input.toString().slice(0, 12);
        this.dniError = false;
      } else if (input < 999999) {
        this.userFormData.DNI = input;
        this.dniError = true;
      }
      else if (input < 0) {
        this.userFormData.DNI = input;
        this.dniError = true;
      }
      else {
        this.userFormData.DNI = input;
        this.dniError = false;
      }
    },
    filterNumber(Value) {
      // Impide la entrada de caracteres que no sean dígitos
      const input = parseInt(Value.replace(/[D]/g, ''));
      return input;
    },
    getMaxDate() {
      const today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
      let year = today.getFullYear() - 18;

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
      let year = today.getFullYear() - 90;
      return `${year}-01-01`;

    },
    async registerUser() {
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
        const response = await axios.post(this.backendUrl, this.userFormData, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          let LocalUseeData = JSON.parse(localStorage.UserData);
          LocalUseeData.Nombres = this.userFormData.Nombres;
          LocalUseeData.Apellidos = this.userFormData.Apellidos;
          LocalUseeData.DNI = this.userFormData.DNI;
          LocalUseeData.CorreoElectronico = this.userFormData.CorreoElectronico;
          LocalUseeData.FechaNacimiento = this.userFormData.FechaNacimiento;
          LocalUseeData.PaisNacimiento = this.userFormData.PaisNacimiento;
          LocalUseeData.EstadoNacimiento = this.userFormData.EstadoNacimiento;
          LocalUseeData.CiudadNacimiento = this.userFormData.CiudadNacimiento;
          LocalUseeData.Genero = this.userFormData.Genero;
          LocalUseeData.Username = this.userFormData.Username;
          LocalUseeData.Password = this.userFormData.Password
          LocalUseeData.DireccionCorrespondencia = this.userFormData.DireccionCorrespondencia;
          LocalUseeData.TemasLiterariosPreferencia = this.userFormData.TemasLiterariosPreferencia;
          LocalUseeData.Tipo = 'Cliente';
          localStorage.UserData = JSON.stringify(LocalUseeData);
          this.loading = false;
          alert("Edicion exitoss: " + response.data.Data); // Muestra el mensaje de éxito
          this.$router.push('/search-book'); // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
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
}
</script>

<style scoped>
.txt-lg {
  font-size: 1.3rem;
  /* You can adjust the value as needed */
}

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