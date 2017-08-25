import ProviderContext from "./provider-context";

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
}