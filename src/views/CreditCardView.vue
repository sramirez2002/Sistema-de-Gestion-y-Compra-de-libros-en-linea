<template>
  <div>
    <!-- NAV BAR -->
    <ToolBar :vista="name" />
    <!-- END NAV BAR -->
    <div class="container p-5">
      <div class="row p-3">
        <div class="payment-method-view">
          <h1 style="color: #230007">Nuevo metodo de pago</h1>
          <v-credit-card @change="creditInfoChanged" @cardChanged="cardChanged" :trans="translations" />
        </div>
      </div>
    </div>
    <button type="submit" @click="SendCard" class="TardisBoton" :disabled="!FullCamps">Guardar</button>
    <!-- Cargando -->
    <CargandoV :Show="loading" />
    <!--Fin Cargando -->
  </div>
</template>

<script>
import axios from 'axios';
import VCreditCard from 'v-credit-card';
import 'v-credit-card/dist/VCreditCard.css'; // Asegúrate de importar los estilos
import ToolBar from '@/components/ToolBar.vue';
import CargandoV from '@/components/CargandoV.vue';

export default {
  components: {
    VCreditCard,
    ToolBar,
    CargandoV
  },
  data() {
    return {
      loading: false,
      FullCamps: false,
      name: 'CreditCardView',
      cardInfo: {
        name: '',
        cardNumber: '',
        expiration: '',
        security: '',
        cardType: ''
      },
      UserMail: JSON.parse(localStorage.UserData).CorreoElectronico,
      translations: {
        name: {
          label: 'Nombre del Titular',
          placeholder: 'Ingresa el nombre completo'
        },
        card: {
          label: 'Número de Tarjeta',
          placeholder: 'Ingresa el número de tarjeta'
        },
        expiration: {
          label: 'Fecha de Expiración'
        },
        security: {
          label: 'CVV',
          placeholder: 'CVV'
        }
      }
    };
  },
  mounted() {
    this.fetchBackendUrl();
  },
  methods: {
    fetchBackendUrl() {
      const configUrl = 'https://backends-15b02-default-rtdb.firebaseio.com/Urls/Libreria.json';
      axios.get(configUrl)
        .then(response => {
          this.backendUrl = response.data;
        })
        .catch(error => {
          console.error('Error fetching backend URL:', error);
          alert('No se pudo obtener la configuración del servidor. Por favor, intente más tarde.');
        });
    },

    SendCard() {
      this.loading = true;
      if (!this.backendUrl) {
        this.loading = false;
        alert('La URL del backend no está disponible. Intente nuevamente.');
        return;
      }
      axios.post(this.backendUrl,
        this.cardInfo,
        {
          headers: {
            'CorreoElectronico': this.UserMail,
            'Action': 'NuevoMetodoPago',
          },
        }
      )
        .then((response) => {
          if (response.data.Status === "True") { // Asegúrate de que esta condición coincida con cómo tu backend envía la respuesta
            this.loading = false;
            alert("Nuevo metodo de pago: " + response.data.Data);
            let Auxiliar = JSON.parse(localStorage.UserData);
            Auxiliar.MetodosPago.push(this.cardInfo);
            localStorage.UserData = JSON.stringify(Auxiliar);
            this.$router.push('/payment');
          } else {
            this.loading = false;
            alert("Ocurrió un error: " + response.data.Data);
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          alert("Ocurrió un error al intentar registrar el método de pago. Por favor, inténtalo de nuevo.");
        });
    },
    isFill(values) {
      console.log(values)
      const lenName = values.name.length // mayor a 0
      const lenCardNumber = values.cardNumber.length // igual a 19
      const lenExpiration = values.expiration.length // igual a 5
      const lenSecurity = values.security.length // igual a 3 o 4
      console.clear()
      console.log(lenName, lenCardNumber, lenExpiration, lenSecurity)
      console.log(lenName > 0 && lenCardNumber === 19 && lenExpiration === 5 && (lenSecurity === 3 || lenSecurity === 4))
      if (lenName > 0 && lenCardNumber === 19 && lenExpiration === 5 && (lenSecurity === 3 || lenSecurity === 4)) {
        this.FullCamps = true
      } else {
        this.FullCamps = false
      }
    },

    creditInfoChanged(values) {
      this.isFill(values)
      this.cardInfo = { ...values };
    },
    cardChanged(type) {
      this.cardInfo.cardType = type;
    }
  }
}
</script>

<style scoped>
.payment-method-view {
  max-width: 600px;
  margin: auto;
  /* box-shadow: 0 0 15px rgba(0,0,0,0.2);  */
  border-radius: 8px;
  background-color: #fff;
}

.output {
  margin-top: 20px;
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 8px;
}

h1,
h2 {
  text-align: center;
}

</style>