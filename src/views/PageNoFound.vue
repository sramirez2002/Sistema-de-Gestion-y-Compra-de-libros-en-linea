<template>
  <div>
    <!-- Barra de navegación -->
    <ToolBar :vista="name" />
    <!-- Fin de la barra de navegación -->

    <!-- Contenedor principal -->
    <div class="container">
      <h1 class="title">¡Oops! Parece que te has perdido en el tiempo y el espacio</h1>
      <h2 class="subtitle">La página que buscas no está en este universo</h2>
      <a class="navbar-brand" href="/">
        <img :src="require('@/assets/logos.png')" alt="logo" class="tardis-img">
      </a>
      <p class="message">Intenta regresar usando la TARDIS o navega por otros rincones de la web.</p>
    </div>
  </div>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue';

export default {
  components: {
    ToolBar 
  },
  name: 'PageNoFound',
  data() {
    return {
      name: 'PageNoFound',
      Email: "",
      backendUrl: ''
    };
  },
  methods: {

  }
}
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 50px;
}

.title {
  font-size: 36px;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 24px;
  margin-bottom: 20px;
}

.tardis-img {
  width: 200px;
  margin-bottom: 20px;
}

.message {
  font-size: 18px;
}
</style>
