<template>
  <div class="search-bar-container">
    <input
      type="text"
      v-model="localSearchQuery"
      @input="filterHistorial"
      @focus="showHistorial = true"
      @blur="hideHistorial"
      placeholder="Titulo"
      class="form-control search-input"
    />
    <ul v-if="showHistorial && filteredHistorial.length" class="historial-list">
      <li
        v-for="(item, index) in filteredHistorial"
        :key="index"
        @mousedown="selectHistorialItem(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localSearchQuery: this.value,
      showHistorial: false,
      historial: JSON.parse(localStorage.UserData).Historial || [],
      filteredHistorial: []
    };
  },
  watch: {
    localSearchQuery(newValue) {
      this.$emit('input', newValue);
    }
  },
  methods: {
    filterHistorial() {
      this.filteredHistorial = this.historial
        .filter(item => item.toLowerCase().includes(this.localSearchQuery.toLowerCase()))
        .slice(0, 5);
    },
    selectHistorialItem(item) {
      this.localSearchQuery = item;
      this.showHistorial = false;
    },
    hideHistorial() {
      setTimeout(() => {
        this.showHistorial = false;
      }, 200);
    }
  }
};
</script>

<style scoped>
.search-bar-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  
}

.historial-list {
  position: absolute;
  z-index: 1;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

.historial-list li {
  padding: 10px;
  cursor: pointer;
}

.historial-list li:hover {
  background: #f0f0f0;
}
</style>
