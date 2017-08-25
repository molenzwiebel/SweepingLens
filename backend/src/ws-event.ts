
interface EventWSEvent {
    type: "event";
    data: object;
}

export type WSEvent = EventWSEvent;