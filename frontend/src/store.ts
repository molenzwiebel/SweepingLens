import Vue from "vue";
import Vuex from "vuex";
import { Provider } from "./types";

Vue.use(Vuex);

export const LOAD_MORE = "loadMore";
export const SET_PROVIDERS_EVENTS = "setProvidersEvents";
export const ADD_EVENTS = "addEvents";

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
};

const mutations: Vuex.MutationTree<State> = {
    [SET_PROVIDERS_EVENTS](state, { providers, events }: { providers: Provider[], events: Event[] }) {
        state.providers = providers;
        state.events = events;
        state.loading = false;
    },
    [ADD_EVENTS](state, events: Event[]) {
        state.events.push(...events);
    }
};

// ---------------- Actions ----------------
export type Actions = {
    LOAD_MORE(): void;
};

const actions: Vuex.ActionTree<State, State> = {
    [LOAD_MORE]({ commit }) {
        // TODO
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