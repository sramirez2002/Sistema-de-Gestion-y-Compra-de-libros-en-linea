<template>
  <div class="chat-card card" style="width: auto; height: min-content;" @click="EntrarEnChat">
    <div class="card-body chat-details">
      <div class="row">
        <div class="mb-3">
          <h5 class="card-title chat-name" style="text-align: left;">{{ chat.Nombre }}</h5>
          <p v-if="Admin" class="card-text" style="text-align: left;">Usuario: {{ chat.Usuario }}</p>
          <!-- /* convierte el numero a moneda */ -->
          <p class="card-text" style="text-align: left;">Ultimo mensaje: {{ chat.UltimoMensaje }}</p>

          <p class="card-text chat-last" style="text-align: left;">{{ chat.Fecha }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chat: Object, // Recibe el objeto del libro como propiedad
    Data: Object
  },
  data() {
    return {
      Admin: false,
    };
  },
  created() {
    this.isAdmin();
  },
  methods: {
    EntrarEnChat() {
      console.clear();
      console.log(this.chat);
      clearInterval();
      this.$router.push({ name: 'MessagesView', params: { chat: this.chat } });
    },

    isAdmin() {
      // Verifica si el usuario es administrador
      if (localStorage.UserData !== undefined) {
        if (JSON.parse(localStorage.UserData).Tipo === "Admin") {
          this.Admin = true;
        }
      }
      if (JSON.parse(localStorage.UserData).Tipo === "Admin") {
        this.Admin = true;
      }
    },
  }
};
</script>

<style scoped>
.chat-name {
  font-size: 27px;
  font-weight: bold;
}

.chat-card {
  margin-bottom: 20px;
  /* borde */
  border-color: #4c0000;

}

.chat-card:hover {
  background-color: rgb(229, 229, 229);
  cursor: pointer;
}

.chat-details {
  display: flex;
  flex-direction: column;
  font-size: 20px;
}

.chat-last {
  color: green;
  font-size: 24px;

  font-weight: bold;
}

.card-text {
  text-align: left;
}
</style>
