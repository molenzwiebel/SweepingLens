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
        const [providerReq, eventReq] = await Promise.all([
            fetch("http://localhost:8888/providers"),
            fetch("http://localhost:8888/events")
        ]);

        const { events, total } = await eventReq.json();

        this.setData({
            providers: await providerReq.json(),
            totalEvents: total,
            events
        });

        this.ws.onmessage = this.handleWebsocketMessage;

        // Ask to display notifications.
        if (Notification && (<any>Notification).permission !== "denied") {
            Notification.requestPermission(state => {
                console.log("Permission state changed to " + state);
            });
        }
    }

    private handleWebsocketMessage(event: MessageEvent) {
        const { type, data }: { type: string, data: any } = JSON.parse(event.data);
        if (type === "event") {
            this.emit(data);
        }
    }
}