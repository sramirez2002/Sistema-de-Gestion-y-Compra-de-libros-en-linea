<template>
  <div>
    <div v-if="mensaje.Usuario == Username">
      <!-- Se debe alinear a la dereca el contrenedor -->
      <div class="message-card card" style="width: 70%; height: min-content; margin-left: auto;">
        <div class="card-body message-details">
          <div class="row">
            <div >
              <p class="card-text message-message" style="text-align: left;">{{ mensaje.Mensaje }}</p>
              <p class="card-text message-date" style="text-align: left;">{{ mensaje.Fecha }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="message-card card" style="width: 70%; height: min-content;">
        <div class="card-body message-details">
          <div class="row">
            <div >
              <h5 class="card-title message-name" style="text-align: left;">{{ mensaje.Usuario }} ({{Tipo}})</h5>
              <p class="card-text message-message" style="text-align: left;">{{ mensaje.Mensaje }}</p>
              <p class="card-text message-date" style="text-align: left;">{{ mensaje.Fecha }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    mensaje: Object, // Recibe el objeto del libro como propiedad
    Data: Object
  },
  data() {
    return {
      Admin: false,
      Username: JSON.parse(localStorage.UserData).Username,
      Tipo: this.mensaje.Tipo
    };
  },
  created() {
    this.isAdmin();
  },
  methods: {
    EntrarEnChat() {
      this.$router.push({ name: 'ChatView', params: { id: this.chat.Id } });
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

.message-card {
  margin-bottom: 20px;
  /* borde */
  border-color: #4c0000;
  
}
.message-details {
  display: flex;
  flex-direction: column;
  font-size: 20px;
}


.message-name {
  font-size: 27px;
  font-weight: bold;
  color:  #4c0000;
}
.message-message {
  color: rgb(0, 0, 0);
  font-size: 90%;

}
.message-date {
  color: green;
  font-size: 70%;
  font-weight: bold;
  /* Debe quedar en la esquina de abajo a la derecha */
  position: absolute;
  bottom: 1%;
  right: 1%;

}

.card-text {
  text-align: left;
}
</style>
