<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <div>
            <div class="d-flex align-items-center justify-content-center">
            <img :src="require('@/assets/logos.png')" alt="logo" width="50">
            <h5 class="ml-2" style="color: #230007; margin-top:8%;">La Tardis</h5>
            </div>
        </div>
      </a>
      <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link v-if="Views.LoginView" to="/login" class="btn btn-outline-light TooBarBoton">Iniciar
              sesión</router-link>
            <router-link v-if="Views.AdministratorEditView" to="/admin-edit"
              class="btn btn-outline-light TooBarBoton">Perfil</router-link>
            <router-link v-if="Views.ClienteEditView" to="/cliente-edit"
              class="btn btn-outline-light TooBarBoton">Perfil</router-link>
            <router-link v-if="Views.SearchBookView" to="/search-book"
              class="btn btn-outline-light TooBarBoton">Buscar</router-link>
            <router-link v-if="Views.AddBookView" to="/add-book"
              class="btn btn-outline-light TooBarBoton">Agregar</router-link>
            <router-link v-if="Views.RecentBooksView" to="/recents" class="btn btn-outline-light TooBarBoton">Nuevos
              libros</router-link>
            <router-link v-if="Views.HistoricalBooksView" to="/historical"
              class="btn btn-outline-light TooBarBoton">Histórico de libros</router-link>
            <router-link v-if="Views.PaymentMethodsView" to="/payment" class="btn btn-outline-light TooBarBoton">Método
              de Pago</router-link>
            <!---<router-link v-if="Views.CreditCardView" to="/credit-card" class="btn btn-outline-light TooBarBoton">Nuevo
            Métodode Pago</router-link>--->
            <router-link v-if="Views.RegisterView" to="/register"
              class="btn btn-outline-light TooBarBoton">Registrarse</router-link>
            <router-link v-if="Views.AdministratorRegisterView" to="/administrator-register"
              class="btn btn-outline-light TooBarBoton">Registrarse</router-link>
            <router-link v-if="Views.HistoryView" to="/history"
              class="btn btn-outline-light TooBarBoton">Compras</router-link>
            <router-link v-if="Views.ChatsView" to="/chats" class="btn btn-outline-light TooBarBoton">Foro</router-link>
            <router-link to="/maps" class="btn btn-outline-light TooBarBoton">Mapa</router-link>
            <!-- Icono de un carrito -->
            <router-link v-if="Views.CarritoView" to="/carrito" class="btn btn-outline-light TooBarBoton">
              <span class="material-symbols-outlined">
                shopping_cart
              </span>
              <span v-if="cartCount !== 0" class="badge badge-danger">{{ cartCount }}</span>
            </router-link>
            <!-- Always show map button -->
            <button type="button" v-if="Views.Logout" @click="CerrarSesion"
              class="btn btn-outline-light TooBarBoton">Cerrar
              sesión</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    vista: String, // Recibe el objeto del libro como propiedad
  },
  data() {
    return {
      Views: {
        // Aqui se ponen las vistas CON EL NOMBRE DE LA VISTA 
        LoginView: true,
        AdministratorEditView: true,
        ClienteEditView: true,
        RegisterView: true,
        ChangePassword: true,
        AdministratorRegisterView: true,
        SendConfirmationView: true,
        AddBookView: true,
        EditBookView: true,
        RecentBooksView: true,
        SearchBookView: true,
        CreditCardView: true,
        PaymentMethodsView: true,
        PageNoFound: true,
        HistoricalBooksView: true,
        Logout: true,
        BookPageView: true,
        ChatsView: true,
        MessagesView: true,
        MapsView: true,
        CarritoView: true,
        HistoryView: true
      },
      cartCount: 0,
    };
  },
  created() {
    this.ToolBar();
  },
  methods: {
    CerrarSesion() {
      const Confirmacion = window.confirm("¿Estás seguro que deseas cerrar sesión?");
      if (Confirmacion) {
        localStorage.UserData = JSON.stringify({ "Tipo": "Visitante" });
        this.$router.push('/login');
      }
    },
    ToolBar() {
      if (localStorage.UserData === undefined) {
        localStorage.UserData = JSON.stringify({ "Tipo": "Visitante" });
      }
      try {
        this.cartCount = JSON.parse(localStorage.UserData).Carrito.length;
        if (this.cartCount === undefined) {
          this.cartCount = 0;
        }
        else if (this.cartCount === null) {
          this.cartCount = 0;
        }
        else if (this.cartCount === "") {
          this.cartCount = 0;
        }
        else if (this.cartCount >= 9) {
          this.cartCount = "9+";
        }
      } catch (error) {
        this.cartCount = 0;
      }


      // Aqui se ponen las vistas que no puede acceder cada tipo de usuario
      this.UserType = JSON.parse(localStorage.UserData).Tipo;
      if (this.UserType === "Admin") {
        this.Views.CreditCardView = false;
        this.Views.RegisterView = false;
        this.Views.AdministratorRegisterView = false;
        this.Views.ClienteEditView = false;
        this.Views.PaymentMethodsView = false;
        this.Views.LoginView = false;
        this.Views.CarritoView = false;
        this.Views.HistoryView = false;
      } else if (this.UserType === "Visitante") {
        this.Views.AdministratorEditView = false;
        this.Views.EditBookView = false;
        this.Views.AddBookView = false;
        this.Views.PaymentMethodsView = false;
        this.Views.CreditCardView = false;
        this.Views.AdministratorRegisterView = false;
        this.Views.Logout = false;
        this.Views.AdministratorEditView = false;
        this.Views.ClienteEditView = false;
        this.Views.ChatsView = false;
        this.Views.MessagesView = false;
        this.Views.CarritoView = false;
        this.Views.HistoryView = false;
      } else if (this.UserType === "Cliente") {
        this.Views.AdministratorEditView = false;
        this.Views.LoginView = false;
        this.Views.EditBookView = false;
        this.Views.AddBookView = false;
        this.Views.RegisterView = false;
        this.Views.AdministratorRegisterView = false;
        this.Views.AdministratorEditView = false;
      } else if (this.UserType === "Root") {
        this.Views.AdministratorEditView = false;
        this.Views.LoginView = false;
        this.Views.SearchBookView = false;
        this.Views.EditBookView = false;
        this.Views.AddBookView = false;
        this.Views.RecentBooksView = false;
        this.Views.PaymentMethodsView = false;
        this.Views.CreditCardView = false;
        this.Views.RegisterView = false;
        this.Views.ChangePassword = false;
        this.Views.HistoricalBooksView = false;
        this.Views.BookPageView = false;
        this.Views.AdministratorEditView = false;
        this.Views.ClienteEditView = false;
        this.Views.ChatsView = false;
        this.Views.MessagesView = false;
        this.Views.CarritoView = false;
        this.Views.HistoryView = false;
      }
      // Si un usuario no tiene permiso para acceder a una vista, lo redirige a la vista de búsqueda de libros
      if (this.Views[this.vista] === false) {
        this.$router.push('/search-book');
      }
      // Oculta la vista actual en la barra de navegación
      this.Views[this.vista] = false;
    },
  },
};
</script>

<style scoped>
.navbar-toggler {
  color: #230007;
}

.TooBarBoton {
  color: #230007;
}

.TooBarBoton:hover {
  background-color: #230007;
  color: white;
}
</style>
