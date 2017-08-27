import Vue from "vue";
import Component from "vue-class-component";
import ProviderComponent from "../provider/provider.vue";

import { State as state } from "vuex-class";
import { State } from "../../store";

@Component({
    components: {
        provider: ProviderComponent
    }
})
export default class Providers extends Vue {
    @state loading: State["loading"];
    @state providers: State["providers"];
}