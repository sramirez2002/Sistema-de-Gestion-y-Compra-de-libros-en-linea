<template>
  <div>
    <div class="control-instruction">Para mayor control, oprimir Shift</div>
    <div ref="target"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const target = ref();



const scene = new THREE.Scene();
scene.position.set(0, 0, 0);
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth * (3 / 4)) / (window.innerHeight / 2), 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const controls = new OrbitControls(camera, renderer.domElement);
renderer.setSize((window.innerWidth * (3 / 4)), (window.innerHeight / 2));
renderer.setViewport(0, 0, (window.innerWidth * (3 / 4)), (window.innerHeight / 2));
//Estilos del canvas
renderer.domElement.style.border = '1px solid rgb(222, 222, 222)';
renderer.domElement.style.borderRadius = '1ch';
/// Centrar el canvas en horizontal
renderer.domElement.style.margin = 'auto';
renderer.domElement.style.marginBottom = '1ch';

//  Coloca una luz general
const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 3);
scene.add(light);



//
window.addEventListener('resize', () => {
  camera.aspect = (window.innerWidth * (3 / 4)) / (window.innerHeight / 2);
  camera.updateProjectionMatrix();
  renderer.setSize((window.innerWidth * (3 / 4)), (window.innerHeight / 2));
}, false);
async function loadModelFromIndexedDB(fileName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("3DModelsDB", 1);

    request.onerror = function (event) {
      reject("Error al abrir la base de datos: " + event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(["models"], "readonly");
      const objectStore = transaction.objectStore("models");
      const modelRequest = objectStore.get(fileName);

      modelRequest.onsuccess = function () {
        if (modelRequest.result) {
          resolve(modelRequest.result.base64);
        } else {
          reject("No se encontró el modelo en IndexedDB");
        }
      };

      modelRequest.onerror = function (event) {
        reject("Error al recuperar el modelo de IndexedDB: " + event.target.error);
      };
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore("models", { keyPath: "fileName" });
    };
  });
}


// Aqui se agregga el objeto 3D


/// Agregar un archivo .obj
let fileName = localStorage.getItem('bookModelFileName'); // Asumimos que el nombre del archivo está guardado en LocalStorage


const loader = new GLTFLoader();
if (fileName) {
  try {
    const base64 = loadModelFromIndexedDB(fileName);
    console.log(base64);

    loadModelFromIndexedDB(fileName)
      .then((base64) => {
        const fileData = atob(base64);
        let byteNumbers = new Array(fileData.length);
        for (var i = 0; i < fileData.length; i++) {
          byteNumbers[i] = fileData.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);

        loader.load(url, function (gltf) {
          gltf.scene.scale.set(1, 1, 1);
          scene.add(gltf.scene);
        }, undefined, function (error) {
          console.error(error);
        });
      })
      .catch((error) => {
        console.error(error);
      });

  } catch (error) {
    console.error(error);
  }
} else {
  console.error("No se encontró el nombre del archivo en LocalStorage");
}


camera.position.z = 14;
camera.position.x = 10;
controls.update();
function animate() {
  console.log();
  controls.update();
  controls.enableDamping = true;
  controls.minDistance = 5;
  controls.maxDistance = 20;
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

onMounted(() => {
  target.value.appendChild(renderer.domElement);
  animate();
});
</script>


<style scoped>
.product-card:hover {
  color: rgb(222, 222, 222);
}
</style>
