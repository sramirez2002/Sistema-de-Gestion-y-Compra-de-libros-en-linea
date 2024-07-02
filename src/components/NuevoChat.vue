<template>
  <div class="overlay" v-if="Show">
    <div class="card">
      <div class="card-body">
        <h1>Nombre del chat</h1>
        <div class="form-group">
          <h6 for="Nombre"> Motivo por el cual necesita ayuda</h6>
          <h6 for="Ejemplo"> Ej: Cobro extra</h6>
          <input type="text" class="form-control" id="Nombre" v-model="Chat.Nombre" placeholder="Nombre del chat"
            @input="validateInput()">
        </div>
        <!-- Dos botenes aceptar cancelar -->
        <button :disabled="chatNameError" @click="Aceptar()" type="text" class="btn btn-primary BotonPopUp">Aceptar</button>
        <button @click="Cancelar()" type="text" class="btn btn-danger BotonPopUp">Cancelar</button>

      </div>
    </div>
    <!-- Cargamdo -->
    <CargandoV :Show="loading" />
    <!--Fin Cargamdo -->
  </div>
</template>

<script>
import axios from 'axios';
import CargandoV from '@/components/CargandoV.vue';
export default {
  components: {
    CargandoV
  },
  props: {
    Show: Boolean, // Recibe el objeto del libro como propiedad
    BackendUrl: String,
  },
  data() {
    return {
      Chat: {
        Nombre: '',
        Usuario : JSON.parse(localStorage.UserData).Username
      },
      chatNameError: true,
      loading: false
    };
  },
  methods: {
    async Aceptar() {
      // Aqui se debe hacer la peticion para crear un nuevo chat
      //this.$emit('input', false);
      console.log(this.BackendUrl);
      const headers = {
        'Action': 'NewChat',
        'Content-Type': 'application/json'
      };
      this.loading = true;
      try {
        const response = await axios.post(this.BackendUrl, this.Chat, { headers });
        // Suponiendo que el backend responde con un objeto que incluye una propiedad de estado y un mensaje
        if (response.data && response.data.Status === "True") {
          // Suponiendo que `status` y `message` son parte de la respuesta del backend
          this.loading = false;
          alert("Actualizacion exitosa: " + response.data.Data); // Muestra el mensaje de éxito
          this.$emit('input', false); // Redirige al usuario a la página de inicio de sesión o a donde consideres apropiado
        } else {
          // Si el backend indica que no fue exitoso el registro
          this.loading = false;
          alert("Error en la Actualizacion: " + response.data.Data); // Muestra mensaje de error
        }
      } catch (error) {
        console.error(error);
        // Aquí podrías manejar errores específicos de la petición
        this.loading = false;
        alert("Error al intentar actualizar. Por favor, inténtalo de nuevo.");
      }
    },
    Cancelar() {
      this.$emit('input', false);
    },
    validateInput() {
      this.Chat.Nombre = this.Chat.Nombre.slice(0, 50);
      if (/[^a-zA-Z0-9 ]/.test(this.Chat.Nombre)) {
        this.chatNameError = true; // Establece el estado de error para Username
        this.Chat.Nombre = this.Chat.Nombre.replace(/[^a-zA-Z0-9 ]/g, '');
      } else {
        this.chatNameError = false; // Limpia el estado de error si el input es válido
      }
      if (this.Chat.Nombre.length < 10) {
        this.chatNameError = true; // Establece el estado de error para Username
      }
    },

  }
};
</script>


<style scoped>
.card {
  width: auto;
  height: min-content;
  border-radius: 3ch;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(104, 104, 104, 0.914);
  /* Blanco semitransparente */
  z-index: 999;
  /* Asegura que esté por encima de todo */
  display: flex;
  justify-content: center;
  align-items: center;
}

.BotonPopUp {
  margin: 1ch;
}
.BotonPopUp:disabled {
  background-color: #d3d3d3;
  color: #000;
  border-color:  #d3d3d3;
}
</style>
