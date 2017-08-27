import Vue from "vue";
import Component from "vue-class-component";

import { Provider } from "../../types";
import ConfigOptionComponent from "../config-option/config-option.vue";

import { State as state, Mutation as mutation } from "vuex-class";
import { State, Mutations, TOGGLE_PROVIDER_SHOWN, TOGGLE_PROVIDER_NOTIFICATIONS } from "../../store";

@Component({
    props: {
        provider: Object
    },
    components: {
        configOption: ConfigOptionComponent
    }
})
export default class ProviderComponent extends Vue {
    @state disabledProviders: State["disabledProviders"];
    @state notifications: State["notifications"];
    @mutation(TOGGLE_PROVIDER_SHOWN) toggleProvider: Mutations["TOGGLE_PROVIDER_SHOWN"];
    @mutation(TOGGLE_PROVIDER_NOTIFICATIONS) toggleNotifications: Mutations["TOGGLE_PROVIDER_NOTIFICATIONS"];
    provider: Provider;

    get isShown() {
        return this.disabledProviders.indexOf(this.provider.id) === -1;
    }

    get notificationsEnabled() {
        return this.notifications.indexOf(this.provider.id) !== -1;
    }

    toggleShown() {
        this.toggleProvider(this.provider);
    }

    toggleNotifs() {
        this.toggleNotifications(this.provider);
    }
}