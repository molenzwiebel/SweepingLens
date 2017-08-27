import Vue from "vue";
import Component from "vue-class-component";
import ProviderComponent from "../provider/provider.vue";

import { State as state, Getter as getter } from "vuex-class";
import { State, Getters } from "../../store";

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
}