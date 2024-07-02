<template>
  <div class="d-flex flex-column vh-100">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <!-- Titulo -->
    <div class="titulo-container">
      <h1 class="text-center" style="color: #230007;">{{ conversations.Nombre }}</h1>
    </div>
    <!-- Contenedor scrolleable -->
    <div class="flex-grow-1 overflow-auto" id="ContenedorMensajes">
      <ul v-if="conversations.Mensajes.length > 0" class="mt-3 list-unstyled" style="margin-left:1vh;margin-right:1vh;">
        <li v-for="mensaje in conversations.Mensajes" :key="mensaje.Fecha">
          <MessageElement :mensaje="mensaje" />
        </li>
      </ul>
      <div v-else>
        <p class="text-center">No hay mensajes.</p>
      </div>
    </div>
    <!-- Barra de mensajes -->
    <div class="BarraMensaje">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Escribe un mensaje..." v-model = "mensaje"
          @input="validarmensaje()">
        <button @click="Enviar()" :disabled="errorMensaje" class="sendBotton btn btn-outline-secondary" type="button"
          id="button-addon2">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';
import MessageElement from '@/components/MessageElement.vue';

export default {
  components: {
    ToolBar,
    MessageElement
  },
  props: {
    chat: Object // Recibe el objeto del libro como propiedad
  },
  name: 'MessagesView',
  data() {
    return {
      chats: [],
      conversations: this.$route.params.chat,
      name: 'MessagesView',
      backendUrl: "null",
      mensaje: "",
      MensajeaEnviar: "",
      errorMensaje: true,
    };
  },
  methods: {
    validarmensaje() {
      console.clear();
      console.log(this.mensaje);
      if (this.mensaje.length > 0) {
        this.errorMensaje = false;
      } else {
        this.errorMensaje = true;
      }
    },
    Enviar() {
      console.clear();
      console.log("Enviando mensaje...");
      this.MensajeaEnviar = this.mensaje;
      this.mensaje = "";
      this.errorMensaje = true;
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
    async GetMessages() {
      // espera UN SEGUNDO
      await new Promise(resolve => setTimeout(resolve, 1000));
      var element = document.getElementById("ContenedorMensajes");
      element.scrollTop = element.scrollHeight

      // Cada segundo se actualiza la lista de chats
      this.fetchMessages();
      setInterval(() => {
        if (this.$route.name === 'MessagesView') {
          this.fetchMessages();
        } else
          clearInterval();
      }, 1000);
      
    },
 
    async fetchMessages() {
      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }
      if (this.MensajeaEnviar != "") {
        const headers = {
          'Action': 'SendMessage'
        };
        const body = {
          'Id': this.$route.params.chat.Id,
          'Mensaje': this.MensajeaEnviar,
          'Usuario': JSON.parse(localStorage.UserData).Username,
          'Tipo': JSON.parse(localStorage.UserData).Tipo

        };
        try {
          this.MensajeaEnviar = "";
          const response = await axios.post(this.backendUrl, body, { headers });
          if (response.data && response.data.Status === "True") {
            console.log("Mensaje enviado");
            var element2 = document.getElementById("ContenedorMensajes");
            element2.scrollTop = element.scrollHeight;
          } else {
            alert("error: " + response.data.Data);
          }
        } catch (error) {
          console.error(error);
          this.chats = []; // Limpiar resultados en caso de error
        }
      }



      const headers = {
        'Action': 'GetMessages'
      };
      const body = {
        'Id': this.$route.params.chat.Id
      };

      try {
        const response = await axios.post(this.backendUrl, body, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          let index1 =  response.data.Data.Mensajes.length - 1;
          let index2 =  this.conversations.Mensajes.length - 1;
          let Actual = this.conversations.Mensajes[index2];
          let Nuevo = response.data.Data.Mensajes[index1];
          this.conversations = response.data.Data;
          //Hace escroll hacia abajo en el contenedor de mensajes
          /*
          */
         console.log("Actual: " + Actual.Mensaje);
         console.log("Nuevo: " + Nuevo.Mensaje);
          if (Actual.Mensaje != Nuevo.Mensaje) { 
            var element = document.getElementById("ContenedorMensajes");
            element.scrollTop = element.scrollHeight;
          }
        } else {
          alert("error: " + response.data.Data);
        }
      } catch (error) {
        console.error(error);
        this.chats = []; // Limpiar resultados en caso de error
      }
    }
  },
  mounted() {
    this.fetchBackendUrl();
  },
  created() {
    this.GetMessages();
  }
}
</script>

<style scoped>
.titulo-container {
  padding: 1rem;
  
}
.sendBotton {
  background-color: #4c0000;
  color: white;
  cursor: pointer;
}
.overflow-auto {
  border-top: 1px solid #4c0000;
  overflow-y: auto;
  border-bottom: 1px solid #4c0000;
}

.BarraMensaje {
  padding-top: 1%;
  padding-bottom: 1%;
  background-color: white;
  margin-left: 1vh;
  margin-right: 1vh;
}
</style>