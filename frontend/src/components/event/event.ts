import Vue from "vue";
import Component from "vue-class-component";
import { Event, Provider } from "../../types";

@Component({
    props: {
        event: Object,
        provider: Object
    }
})
export default class EventComponent extends Vue {
    event: Event;
    provider: Provider;
    expanded = false;

    toggleExpand() {
        this.expanded = !this.expanded;

        if (this.expanded) {
            // This needs to run the next tick.
            this.$nextTick(() => {
                const content = this.$refs.content as Element;
                const range = document.createRange();
                range.setStart(content, 0);
                content.appendChild(range.createContextualFragment(this.event.body));
            });
        }
    }
}