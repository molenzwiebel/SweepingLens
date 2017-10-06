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
    @state loadingEvents: State["loadingEvents"];
    @state moreEvents: State["moreEvents"];
    @state providers: State["providers"];
    @state events: State["events"];
    @getter filteredEvents: Getters["filteredEvents"];
    @action(LOAD_MORE) loadItems: Actions["LOAD_MORE"];
    private loadingMore = false;

    mounted() {
        // If the currently shown events change, check if we need to fetch more.
        this.$watch("filteredEvents.length", () => {
            console.log("Rerendering");
            this.$emit("rerender");
        });
    }

    providerFor(event: Event): Provider {
        return this.providers.filter(x => x.id === event.provider)[0];
    }

    get loadMoreDisabled() {
        return this.loadingMore || this.loadingEvents || !this.moreEvents;
    }

    async loadMore() {
        if (!this.events.length) return;

        this.loadingMore = true;
        await this.loadItems();
        this.loadingMore = false;
    }
}