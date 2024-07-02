import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBOMMdkq5NYDegFR53hwyWt_AWXtnyk5jE',
    libraries: 'places', // This is required if you use the Autocomplete plugin
  },
});
