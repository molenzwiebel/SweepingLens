import Vue from "vue";
import Vuex from "vuex";
import { Event, Provider } from "./types";

Vue.use(Vuex);

export const LOAD_MORE = "loadMore";
export const SET_PROVIDERS_EVENTS = "setProvidersEvents";
export const ADD_EVENTS = "addEvents";
export const RECEIVE_EVENT = "receiveEvent";
export const TOGGLE_PROVIDER_SHOWN = "toggleProviderShown";
export const TOGGLE_PROVIDER_NOTIFICATIONS = "toggleProviderNotifications";

// ---------------- State ----------------
export type State = {
    providers: Provider[],
    events: Event[],
    totalEvents: number,
    disabledProviders: string[],
    notifications: string[],
    loading: boolean,
    moreEvents: boolean
};

// ---------------- Getters ----------------
export type Getters = {
    filteredEvents: Event[]
};

const getters: Vuex.GetterTree<State, State> = {
    filteredEvents(state) {
        return state.events.filter(x => state.disabledProviders.indexOf(x.provider) === -1);
    }
};

// ---------------- Mutations ----------------
export type Mutations = {
    SET_PROVIDERS_EVENTS({ providers, events, totalEvents }: { providers: Provider[], events: Event[], totalEvents: number }): void;
    ADD_EVENTS(events: Event[]): void;
    RECEIVE_EVENT(event: Event): void;
    TOGGLE_PROVIDER_SHOWN(provider: Provider): void;
    TOGGLE_PROVIDER_NOTIFICATIONS(provider: Provider): void;
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
    }
};

// ---------------- Actions ----------------
export type Actions = {
    LOAD_MORE(): Promise<void>;
};

const actions: Vuex.ActionTree<State, State> = {
    async [LOAD_MORE]({ state, commit }) {
        const req = await fetch("http://localhost:8888/events?max_id=" + state.events[state.events.length - 1].id);
        const items: { events: Event[] } = await req.json();
        commit(ADD_EVENTS, items.events);
    }
};

// ---------------- Store ----------------
export default new Vuex.Store<State>({
    state: {
        providers: [],
        events: [],
        totalEvents: 0,
        disabledProviders: JSON.parse(localStorage.getItem("disabledProviders") || "[]"),
        notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
        loading: true,
        moreEvents: true
    },
    getters,
    mutations,
    actions
});