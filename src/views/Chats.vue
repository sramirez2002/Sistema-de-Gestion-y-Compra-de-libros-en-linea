<template>
  <div class="fluid-container">
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <div class="container mt-4">
      <h1 class="text-center " style="color: #230007;">Lista de chats</h1>
      <button v-if="NoAdmin" @click="NuevoChat" class="TardisBoton mb-4">Nuevo Chat</button>
      <ul v-if="chats.length > 0" class="mt-3 list-unstyled">
        <li v-for="chat in chats" :key="chat.Id">
          <ChatElement :chat="chat" />
        </li>
      </ul>
      <div v-else>
        <p class="text-center">No hay chats para mostrar.</p>
      </div>
    </div>
    <NuevoChat :Show="CreandChat" :BackendUrl="backendUrl" v-model="CreandChat" />
  </div>
</template>

<script>
import axios from 'axios';
import ToolBar from '@/components/ToolBar.vue';
import ChatElement from '@/components/ChatElement.vue';
import NuevoChat from '@/components/NuevoChat.vue';

export default {
  components: {
    ToolBar,
    ChatElement,
    NuevoChat
  },
  name: 'ChatsView',
  data() {
    return {
      chats: [],
      name: 'ChatsView',
      loading: false,
      NoAdmin: true,
      CreandChat: false,
      backendUrl: "null"
    };
  },
  methods: {
    isAdmin() {
      // Verifica si el usuario es administrador
      if (localStorage.UserData !== undefined) {
        if (JSON.parse(localStorage.UserData).Tipo === "Admin") {
          this.NoAdmin = false;
        }
      }
      if (JSON.parse(localStorage.UserData).Tipo === "Admin") {
        this.NoAdmin = false;
      }
    },
    NuevoChat() {
      this.CreandChat = true;
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
    async GetChats() {
      // espera UN SEGUNDO
      await new Promise(resolve => setTimeout(resolve, 1000));


      // Cada segundo se actualiza la lista de chats
      this.fetchChats();
      setInterval(() => {
        if (this.$route.name === 'ChatsView') {
          this.fetchChats();
        } else
          clearInterval();
      }, 2000);
    },

    async fetchChats() {
      if (!this.backendUrl) {
        this.loading = false;
        alert("No se ha podido obtener la URL del backend. Por favor, inténtalo de nuevo.");
        return;
      }
      const headers = {
        'Action': 'GetChats'
      };
      const body = {
        'Tipo': JSON.parse(localStorage.UserData).Tipo,
        "Usuario": JSON.parse(localStorage.UserData).Username
      };

      try {
        const response = await axios.post(this.backendUrl, body, { headers });
        // Suponiendo que el backend responde con un arreglo de libros
        if (response.data && response.data.Status === "True") {
          this.chats = response.data.Data;
        } else {
          alert("error: " + response.data.Data);
        }
      } catch (error) {
        alert('Error al conectarse con el backend. Por favor, inténtalo de nuevo.');
        this.chats = []; // Limpiar resultados en caso de error
      }
    }
  },
  mounted() {
    this.fetchBackendUrl();
  },
  created() {
    this.isAdmin();
    this.GetChats();
  }
}
</script>

<style scoped>
.BotonEsquina {
  margin-right: 8%;
  margin-bottom: 8%;
  position: fixed;
}
</style>