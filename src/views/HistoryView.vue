<template>
  <div>
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->

    <div class="container-fluid text-center p-4 mt-3 mb-3">
      <h1 class="font-bold" style="color: #230007;">Historial de Compras</h1>
      <div
        v-for="(pedido, index) in pedidos"
        :key="index"
        class="container-fluid p-4"
      >
        <div class="card w-100">
          <div class="card-header">
            <div class="container">
              <div class="row">
                <div class="col-12 col-md-6 text-start">Fecha del pedido: {{ pedido.Fecha }}</div>
                <div class="col-12 col-md-6 text-end">
                  <span :class="{
                    'badge-success': pedido.Estado === 'enviado', 
                    'badge-danger': pedido.Estado === 'cancelado', 
                    'badge-warning': pedido.Estado === 'reservado', 
                    'badge-primary': pedido.Estado === 'entregado', 
                    'badge-info': pedido.Estado === 'en tienda'
                  }" class="badge">{{ pedido.Estado }}</span>
                </div>
                <div class="col-12 col-md-6 text-start">Cantidad de libros: {{ pedido.Libros.length }}</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div
              v-for="(item, itemIndex) in pedido.Libros"
              :key="itemIndex"
              class="container"
            >
              <div class="row">
                <div class="col-4 col-md-2 text-center d-flex align-items-center justify-content-center">
                  <img :src="getImage(item.picture)" alt="Imagen del producto" class="img-fluid w-100 w-sm-33" />
                </div>
                <div class="col-8 col-md-10">
                  <p>{{ item.Titulo }}</p>
                  <p>Unidades: {{ item.Cantidad }}</p>
                </div>
              </div>
              <hr class="hr-gruesa">
            </div>
            <button class="TardisBoton" @click="verDetalles(pedido)">Ver detalles</button>
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
    ToolBar,
  },
  data() {
    return {
      pedidos: [],
    };
  },
  created() {
    this.cargarHistorial();
  },
  methods: {
    cargarHistorial() {
      const userData = JSON.parse(localStorage.getItem('UserData'));
      if (userData && userData.Historial) {
        this.pedidos = userData.Historial.map((pedido) => ({
          ...pedido,
          Estado: pedido.Estado.toLowerCase(),
          Libros: pedido.Libros.map(libro => ({
            ...libro,
            picture: 'book.png', // Ajusta el nombre de la imagen si es necesario
          })),
        }));
      }
    },
    getImage(picture) {
      try {
        return require(`@/assets/${picture}`);
      } catch (e) {
        return require('@/assets/book.png'); // Imagen por defecto si no se encuentra la específica
      }
    },
    verDetalles(pedido) {
      localStorage.setItem('detallePedido', JSON.stringify(pedido));
      this.$router.push({ name: 'details' }); // Asegúrate de que la ruta esté configurada correctamente
    }
  },
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
.badge-success {
  background-color: #28a745;
}
.badge-danger {
  background-color: #dc3545;
}
.badge-warning {
  background-color: #ffc107;
}
.badge-primary {
  background-color: #007bff;
}
.badge-info {
  background-color: #17a2b8;
}
.hr-gruesa {
  border-top: 1px solid #ababab;
  opacity: 1;
}
</style>
