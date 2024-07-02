<template>
    <div>
      <!-- NAV BAR -->
      <ToolBar :vista="name" />
      <!-- END NAV BAR -->
      <MapView />
    </div>
  </template>
  
  <script>
  import ToolBar from "@/components/ToolBar.vue";
  import MapView from "@/components/MapView.vue"; // Importa el componente de mapa
  
  export default {
    components: {
      ToolBar,
      MapView, // Agrega el componente de mapa
    },
    data() {
      return {
        name: "MapsView",
      };
    },
  };
  </script>
  