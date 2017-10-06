import Vue from "vue";
import Vuex from "vuex";
import { ConfigOption, Event, Provider } from "./types";

Vue.use(Vuex);

export const LOAD_MORE = "loadMore";
export const SET_PROVIDERS_EVENTS = "setProvidersEvents";
export const ADD_EVENTS = "addEvents";
export const RECEIVE_EVENT = "receiveEvent";
export const TOGGLE_PROVIDER_SHOWN = "toggleProviderShown";
export const TOGGLE_PROVIDER_NOTIFICATIONS = "toggleProviderNotifications";
export const SET_CONFIG_OPTION_VALUE = "setConfigOptionValue";
export const SET_SEARCH_RESULTS = "setSearchResults";
export const SET_SEARCH_QUERY = "setSearchQuery";
export const START_SEARCH = "startSearch";
export const SEARCH = "search";

// ---------------- State ----------------
export type State = {
    providers: Provider[],

    events: Event[],
    totalEvents: number,

    searchQuery: string,
    searchResults: Event[],

    disabledProviders: string[],
    notifications: string[],
    configValues: { [key: string]: any };

    loading: boolean,
    loadingEvents: boolean,
    moreEvents: boolean
};

// ---------------- Getters ----------------
export type Getters = {
    filteredEvents: Event[]
};

const getters: Vuex.GetterTree<State, State> = {
    filteredEvents(state) {
        // If we have a search query and finished loading it, render the results of the search instead.
        const events = (state.searchQuery && !state.loadingEvents && state.searchResults.length)
            ? state.searchResults
            : state.events;

        return events.filter(event => {
            if (state.disabledProviders.indexOf(event.provider) !== -1) return false;

            const provider = state.providers.filter(x => x.id === event.provider)[0];
            if (!provider) return false;

            return provider.options.filter(option => {
                const val = state.configValues[option.id];

                if (typeof val === "undefined" || (Array.isArray(val) && val.length === 0)) return false;
                return !new Function("event", "value", "return " + option.filter + ";")(event, val);
            }).length === 0;
        });
    }
};

// ---------------- Mutations ----------------
export type Mutations = {
    SET_PROVIDERS_EVENTS({ providers, events, totalEvents }: { providers: Provider[], events: Event[], totalEvents: number }): void;
    ADD_EVENTS(events: Event[]): void;
    RECEIVE_EVENT(event: Event): void;
    TOGGLE_PROVIDER_SHOWN(provider: Provider): void;
    TOGGLE_PROVIDER_NOTIFICATIONS(provider: Provider): void;
    SET_CONFIG_OPTION_VALUE({ option, value }: { option: ConfigOption, value: any }): void;
    SET_SEARCH_QUERY(query: string): void;
    START_SEARCH(): void;
    SET_SEARCH_RESULTS(results: Event[]): void;
};

const mutations: Vuex.MutationTree<State> = {
    [SET_PROVIDERS_EVENTS](state, { providers, events, totalEvents }: { providers: Provider[], events: Event[], totalEvents: number }) {
        state.providers = providers;
        state.events = events;
        state.totalEvents = totalEvents;
        state.loading = false;
    },
    [ADD_EVENTS](state, events: Event[]) {
        state.events.push(...events);
        if (events.length === 0) state.moreEvents = false;
    },
    [RECEIVE_EVENT](state, event: Event) {
        state.events.unshift(event);
        state.totalEvents++;

        if (state.notifications.indexOf(event.provider) !== -1 && Notification) {
            const provider = state.providers.filter(x => x.id === event.provider)[0];
            if (!provider) return;
            new Notification("New Event - " + provider.name, <any>{
                body: event.title,
                requireInteraction: true
            });
        }
    },
    [TOGGLE_PROVIDER_SHOWN](state, provider: Provider) {
        const idx = state.disabledProviders.indexOf(provider.id);
        if (idx !== -1) {
            state.disabledProviders.splice(idx, 1);
        } else {
            state.disabledProviders.push(provider.id);
        }
        localStorage.setItem("disabledProviders", JSON.stringify(state.disabledProviders));
    },
    [TOGGLE_PROVIDER_NOTIFICATIONS](state, provider: Provider) {
        const idx = state.notifications.indexOf(provider.id);
        if (idx !== -1) {
            state.notifications.splice(idx, 1);
        } else {
            state.notifications.push(provider.id);
        }
        localStorage.setItem("notifications", JSON.stringify(state.notifications));
    },
    [SET_CONFIG_OPTION_VALUE](state, { option, value }: { option: ConfigOption, value: any }) {
        state.configValues[option.id] = value;
        localStorage.setItem("configValues", JSON.stringify(state.configValues));
    },
    [SET_SEARCH_QUERY](state, query: string) {
        state.searchQuery = query;
    },
    [START_SEARCH](state) {
        state.loadingEvents = true;
    },
    [SET_SEARCH_RESULTS](state, results: Event[]) {
        state.loadingEvents = false;
        state.searchResults = results;
    }
};

// ---------------- Actions ----------------
export type Actions = {
    LOAD_MORE(): Promise<void>;
    SEARCH(): Promise<void>;
};

const actions: Vuex.ActionTree<State, State> = {
    async [LOAD_MORE]({ state, commit }) {
        const req = await fetch("/events?max_id=" + state.events[state.events.length - 1].id);
        const items: { events: Event[] } = await req.json();
        commit(ADD_EVENTS, items.events);
    },
    async [SEARCH]({ state, commit }) {
        if (!state.searchQuery || state.loadingEvents) return;
        commit(START_SEARCH);

        const req = await fetch("/search?q=" + encodeURIComponent(state.searchQuery));
        const items: { events: Event[] } = await req.json();

        commit(SET_SEARCH_RESULTS, items.events);
    }
};

// ---------------- Store ----------------
export default new Vuex.Store<State>({
    state: {
        providers: [],

        events: [],
        totalEvents: 0,

        searchQuery: "",
        searchResults: [],

        disabledProviders: JSON.parse(localStorage.getItem("disabledProviders") || "[]"),
        notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
        configValues: JSON.parse(localStorage.getItem("configValues") || "{}"),

        loading: true,
        loadingEvents: false,
        moreEvents: true
    },
    getters,
    mutations,
    actions
});