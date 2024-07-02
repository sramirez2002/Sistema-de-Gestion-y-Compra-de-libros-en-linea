<template>
  <div class="map-wrapper">
    <div class="content-container">
      <h1 class="map-title">Nuestras Sucursales</h1>
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d8274.40738455042!2d-75.68642539786919!3d4.795136669203575!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1716992196732!5m2!1ses!2sco"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapView',
};
</script>

<style>
.map-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.content-container {
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-title {
  color: #230007;
  font-weight: bold;
  margin-bottom: 20px;
}

.map-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
