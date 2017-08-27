export interface Event {
    id: string;
    provider: string;
    title: string;
    url: string;
    body: string;
    timestamps: {
        created: string;
        emitted: string;
    };
    metadata: object;
}

export interface Provider {
    id: string;
    name: string;
    description: string;
    icon: string;
    options: {
        type: "chips" | "checkbox";
        title: string;
        filter: string;
    }[];
}