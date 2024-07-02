<template>
    <div class="fluid-container">
      <!-- NAV BAR -->
      <ToolBar :vista="name" />
      <!-- END NAV BAR -->
      <h1 class="text-center p-3" style="color: #230007;">Detalles de la Compra</h1>
  
      <div class="row">
        <div class="container mt-4 col-12 col-md-8">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title h5-titulo">Detalles del Pedido</h5>
              <p class="card-text">Fecha del Pedido: {{ pedido.Fecha }}</p>
              <p class="card-text">Estado: {{ pedido.Estado }}</p>
              <p class="card-text">Método de Pago: {{ pedido.MetodoDePago }}</p>
              <p class="card-text">Método de Envío: {{ pedido.MetodoDeEnvio }}</p>
              <p class="card-text" v-if="pedido.MetodoDeEnvio === 'Recoger'">Ubicación para Recoger: {{ pedido.UbicacionRecoger }}</p>
              <hr class="hr-gruesa">
              <h5 class="card-title h5-titulo">Libros en el Pedido</h5>
              <ul v-if="pedido.Libros.length > 0" class="list-unstyled">
                <li v-for="libro in pedido.Libros" :key="libro.id">
                  <div class="row">
                    <div class="col-4 col-md-2 text-center d-flex align-items-center justify-content-center">
                      <img :src="getImage(libro.picture)" alt="Imagen del producto" class="img-fluid w-100 w-sm-33" />
                    </div>
                    <div class="col-8 col-md-10">
                      <p>{{ libro.Titulo }}</p>
                      <p>Unidades: {{ libro.Cantidad }}</p>
                      <p>Precio: {{ libro.Precio }}</p>
                    </div>
                  </div>
                  <hr class="hr-gruesa">
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="container mt-4 col-12 col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Resumen del Pedido</h5>
              <hr class="hr-gruesa">
              <p class="card-text"> <strong>Total Libros: {{ totalLibros }}</strong> </p>
              <p class="card-text"> <strong>Total: {{ pedido.Total }}</strong> </p>
              <button @click="volver" class="TardisBoton">Volver al Historial</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ToolBar from '@/components/ToolBar.vue';
  
  export default {
    components: {
      ToolBar
    },
    data() {
      return {
        pedido: {},
        totalLibros: 0
      };
    },
    created() {
      this.cargarPedido();
    },
    methods: {
      cargarPedido() {
        const pedido = JSON.parse(localStorage.getItem('detallePedido'));
        if (pedido) {
          this.pedido = pedido;
          this.totalLibros = pedido.Libros.reduce((acc, libro) => acc + libro.Cantidad, 0);
        }
      },
      getImage(picture) {
        try {
          return require(`@/assets/${picture}`);
        } catch (e) {
          return require('@/assets/book.png'); // Imagen por defecto si no se encuentra la específica
        }
      },
      volver() {
        this.$router.push({ name: 'HistoryView' });
      }
    }
  };
  </script>
  
  <style scoped>
  .font-bold {
    font-weight: bold;
  }
  .img-fluid {
    max-width: 100%;
    height: auto;
  }
  .w-sm-33 {
    width: 33.33%;
  }
  .hr-gruesa {
    border-top: 1px solid #ababab;
    opacity: 1;
  }
  .h5-titulo {
    color: #4c0000;
    font-weight: bold;
    text-align: left;
  }
  .TardisBoton {
    background-color: #230007;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
  }
  .TardisBoton:hover {
    background-color: #4c0000;
  }
  </style>
  