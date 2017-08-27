import Vue from "vue";
import Component from "vue-class-component";

import Providers from "../providers/providers.vue";

import { State as state, Mutation as mutation } from "vuex-class";
import { State, Mutations, SET_PROVIDERS_EVENTS } from "../../store";

@Component({
    components: {
        providers: Providers
    }
})
export default class App extends Vue {
    @state loading: State["loading"];
    @mutation(SET_PROVIDERS_EVENTS) setData: Mutations["SET_PROVIDERS_EVENTS"];

    async mounted() {
        const [providers, events] = await Promise.all([
            fetch("http://localhost:8888/providers"),
            fetch("http://localhost:8888/events")
        ]);

        this.setData({
            providers: await providers.json(),
            events: await events.json(),
        });
    }
}