import Vue from "vue";
import Component from "vue-class-component";
import { Provider } from "../../types";

@Component({
    props: {
        provider: Object
    }
})
export default class ProviderComponent extends Vue {
    provider: Provider;
}