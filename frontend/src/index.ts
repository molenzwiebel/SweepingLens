import Vue from "vue";

import VueMaterial = require("vue-material");
import "vue-material/dist/vue-material.css";

import Index from "./components/index/index.vue";

Vue.use(VueMaterial);

new (<any>Index)().$mount("#root");