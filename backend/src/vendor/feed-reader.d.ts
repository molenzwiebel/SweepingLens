declare module "feed-reader" {
    interface Result {
        title: string;
        link: string;
        entries: {
            link: string;
            title: string;
            contentSnippet: string;
            publishedDate: string;
            author: string;
            content: string;
        }[];
    }

    const reader: {
        parse: (url: string) => Promise<Result>
    };

    export = reader;
}