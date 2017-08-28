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
    private ws = new WebSocket(`ws${location.protocol === "https" ? "s" : ""}://${location.hostname}`);

    @state loading: State["loading"];
    @mutation(SET_PROVIDERS_EVENTS) setData: Mutations["SET_PROVIDERS_EVENTS"];
    @mutation(RECEIVE_EVENT) emit: Mutations["RECEIVE_EVENT"];

    async mounted() {
        const [providerReq, eventReq] = await Promise.all([
            fetch("/providers"),
            fetch("/events")
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