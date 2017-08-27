import Vue from "vue";
import Component from "vue-class-component";
import { Provider } from "../../types";

import { State as state, Mutation as mutation } from "vuex-class";
import { State, Mutations, TOGGLE_PROVIDER_SHOWN } from "../../store";

@Component({
    props: {
        provider: Object
    }
})
export default class ProviderComponent extends Vue {
    @state disabledProviders: State["disabledProviders"];
    @mutation(TOGGLE_PROVIDER_SHOWN) toggleProvider: Mutations["TOGGLE_PROVIDER_SHOWN"];
    provider: Provider;

    get isShown() {
        return this.disabledProviders.indexOf(this.provider.id) === -1;
    }

    toggle() {
        this.toggleProvider(this.provider);
    }
}