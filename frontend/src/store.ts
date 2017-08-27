import Vue from "vue";
import Vuex from "vuex";
import { Event, Provider } from "./types";

Vue.use(Vuex);

export const LOAD_MORE = "loadMore";
export const SET_PROVIDERS_EVENTS = "setProvidersEvents";
export const ADD_EVENTS = "addEvents";
export const RECEIVE_EVENT = "receiveEvent";

// ---------------- State ----------------
export type State = {
    providers: Provider[],
    events: Event[],
    loading: boolean,
    moreEvents: boolean
};

// ---------------- Getters ----------------
export type Getters = {
    filteredEvents: Event[]
};

const getters: Vuex.GetterTree<State, State> = {
    filteredEvents(state) {
        return state.events;
    }
};

// ---------------- Mutations ----------------
export type Mutations = {
    SET_PROVIDERS_EVENTS({ providers, events }: { providers: Provider[], events: Event[] }): void;
    ADD_EVENTS(events: Event[]): void;
    RECEIVE_EVENT(event: Event): void;
};

const mutations: Vuex.MutationTree<State> = {
    [SET_PROVIDERS_EVENTS](state, { providers, events }: { providers: Provider[], events: Event[] }) {
        state.providers = providers;
        state.events = events;
        state.loading = false;
    },
    [ADD_EVENTS](state, events: Event[]) {
        state.events.push(...events);
        if (events.length === 0) state.moreEvents = false;
    },
    [RECEIVE_EVENT](state, event: Event) {
        state.events.unshift(event);
    }
};

// ---------------- Actions ----------------
export type Actions = {
    LOAD_MORE(): Promise<void>;
};

const actions: Vuex.ActionTree<State, State> = {
    async [LOAD_MORE]({ state, commit }) {
        const req = await fetch("http://localhost:8888/events?max_id=" + state.events[state.events.length - 1].id);
        const items = await req.json();
        commit(ADD_EVENTS, items);
    }
};

// ---------------- Store ----------------
export default new Vuex.Store<State>({
    state: {
        providers: [],
        events: [],
        loading: true,
        moreEvents: true
    },
    getters,
    mutations,
    actions
});