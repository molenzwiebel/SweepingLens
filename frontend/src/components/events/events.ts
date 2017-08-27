import Vue from "vue";
import Component from "vue-class-component";

import EventComponent from "../event/event.vue";
import infiniteScroll = require("vue-infinite-scroll");

import { Event, Provider } from "../../types";
import { State as state, Action as action, Getter as getter } from "vuex-class";
import { State, Actions, LOAD_MORE, Getters } from "../../store";

@Component({
    directives: {
        infiniteScroll
    },
    components: {
        event: EventComponent
    }
})
export default class Events extends Vue {
    @state loading: State["loading"];
    @state moreEvents: State["moreEvents"];
    @state providers: State["providers"];
    @getter filteredEvents: Getters["filteredEvents"];
    @action(LOAD_MORE) loadItems: Actions["LOAD_MORE"];

    private loadingMore = false;

    providerFor(event: Event): Provider {
        return this.providers.filter(x => x.id === event.provider)[0];
    }

    async loadMore() {
        this.loadingMore = true;
        await this.loadItems();
        this.loadingMore = false;
    }
}