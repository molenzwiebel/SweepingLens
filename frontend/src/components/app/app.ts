import Vue from "vue";
import Component from "vue-class-component";

import Providers from "../providers/providers.vue";
import Events from "../events/events.vue";

import { State as state, Mutation as mutation } from "vuex-class";
import { State, Mutations, SET_PROVIDERS_EVENTS, RECEIVE_EVENT } from "../../store";

@Component({
    components: { Providers, Events }
})
export default class App extends Vue {
    private ws = new WebSocket("ws://localhost:8888");

    @state loading: State["loading"];
    @mutation(SET_PROVIDERS_EVENTS) setData: Mutations["SET_PROVIDERS_EVENTS"];
    @mutation(RECEIVE_EVENT) emit: Mutations["RECEIVE_EVENT"];

    async mounted() {
        const [providers, events] = await Promise.all([
            fetch("http://localhost:8888/providers"),
            fetch("http://localhost:8888/events")
        ]);

        this.setData({
            providers: await providers.json(),
            events: await events.json(),
        });

        this.ws.onmessage = this.handleWebsocketMessage;
    }

    private handleWebsocketMessage(event: MessageEvent) {
        const { type, payload }: { type: string, payload: any } = JSON.parse(event.data);
        if (type === "event") {
            this.emit(payload);
        }
    }
}