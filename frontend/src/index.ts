import Vue from "vue";

import VueMaterial = require("vue-material");
import "vue-material/dist/vue-material.css";
Vue.use(VueMaterial);

import "vue2-animate/dist/vue2-animate.min.css";

import VueTimeago = require("vue-timeago");
import enUS = require("vue-timeago/locales/en-US.json");
Vue.use(VueTimeago, {
    name: "timeago",
    locale: "en-US",
    locales: {
        "en-US": enUS
    }
});

import store from "./store";
import App from "./components/app/app.vue";

new (<any>App)({
    store
}).$mount("#root");