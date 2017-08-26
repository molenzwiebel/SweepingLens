import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Index extends Vue {
    mounted() {
        console.log("Hello, world!");
    }
}