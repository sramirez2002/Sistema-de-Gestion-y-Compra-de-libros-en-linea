<template>
  <div class="overlay" v-if="Show">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  props: {
    Show: Boolean, // Recibe el objeto del libro como propiedad
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>


<style scoped>

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  /* Blanco semitransparente */
  z-index: 999;
  /* Asegura que esté por encima de todo */
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  border: 4px solid #f3f3f3;
  /* Light grey */
  border-top: 4px solid #230007;
  /* Blue */
  border-radius: 100%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
