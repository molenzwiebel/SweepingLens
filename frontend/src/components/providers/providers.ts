import Vue from "vue";
import Component from "vue-class-component";
import ProviderComponent from "../provider/provider.vue";

import { State as state, Getter as getter, Action as action, Mutation as mutation } from "vuex-class";
import {State, Getters, SEARCH, Actions, SET_SEARCH_QUERY, Mutations} from "../../store";

@Component({
    components: {
        provider: ProviderComponent
    }
})
export default class Providers extends Vue {
    @state loading: State["loading"];
    @state providers: State["providers"];
    @state totalEvents: State["totalEvents"];

    @state events: State["events"];
    @getter filteredEvents: Getters["filteredEvents"];

    @action(SEARCH) search: Actions["SEARCH"];
    @mutation(SET_SEARCH_QUERY) setSearchQuery: Mutations["SET_SEARCH_QUERY"];

    updateSearchValue(value: string) {
        this.setSearchQuery(value);
    }
}