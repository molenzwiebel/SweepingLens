import Vue from "vue";
import Component from "vue-class-component";

import { Provider, ConfigOption } from "../../types";

import { State as state, Mutation as mutation } from "vuex-class";
import { State, Mutations, SET_CONFIG_OPTION_VALUE } from "../../store";

@Component({
    props: {
        option: Object
    }
})
export default class ConfigOptionComponent extends Vue {
    @state configValues: State["configValues"];
    @mutation(SET_CONFIG_OPTION_VALUE) setValue: Mutations["SET_CONFIG_OPTION_VALUE"];

    option: ConfigOption;

    get value() {
        const val = this.configValues[this.option.id];
        if (val) return val;

        if (this.option.type === "chips") return [];
        if (this.option.type === "checkbox") return false;

        throw new Error("Unknown option type");
    }

    set value(val: any) {
        this.setValue({
            option: this.option,
            value: val
        });
    }
}