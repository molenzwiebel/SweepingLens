import ProviderContext from "./provider-context";

export interface FilteringOption {
    /**
     * The type of the filtering option.
     */
    type: "chips" | "checkbox";

    /**
     * The title of this filtering option.
     */
    title: string;

    /**
     * A javascript expression that when executed on an event returns whether
     * or not it matches the current filter. `value` is scoped to the value of
     * the filter, `event` is scoped to the event.
     */
    filter: string;
}

export interface Provider<T> {
    /**
     * [a-z]+ string identifying this provider.
     */
    slug: string;

    /**
     * The name of this provider.
     */
    name: string;

    /**
     * A short description of what the data source of this provider is.
     */
    description: string;

    /**
     * A small square icon representing this provider.
     */
    icon: string;

    /**
     * Method that runs when the provider is constructed.
     */
    constructor: (ctx: ProviderContext<T>) => any;

    /**
     * Custom filtering options that the client can define.
     */
    options?: FilteringOption[];
}