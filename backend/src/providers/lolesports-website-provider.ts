import { Provider } from "../provider";
import fetch from "node-fetch";

/**
 * Incomplete typings of the data returned from the lolesports api.
 */
interface MarqueeData {
    articles: {
        author: string;
        bodyFull: string;
        published: string;
        region: string;
        path: {
            canonical: string;
        };
        title: string;
        nid: string;
    }[];
}

const UPDATE_TIME = 30 * 1000; // every 30 seconds

const LoLEsportsWebsiteProvider: Provider<{}> = {
    slug: "lolesports-website",
    name: "LoLEsports Website",
    description: "Tracks all articles on the LoLEsports website.",
    icon: "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/lolesports_feapp/en_US/cf9233664b96f1a3151ba473539405fb2f2b55b8/assets/img/site-logo-small.png",
    constructor(ctx) {
        ctx.setInterval(async () => {
            const req = await fetch("http://api.lolesports.com/api/v1/marquees?locale=en_US");
            const data: MarqueeData = await req.json();

            for (const article of data.articles.reverse()) {
                if (await ctx.hasEvent(article.nid)) continue;

                ctx.log("Found new lolesports featured article: " + article.title);
                ctx.emit({
                    id: article.nid,
                    title: article.title,
                    body: article.bodyFull,
                    url: "http://www.lolesports.com/en_US/" + article.path.canonical,
                    timestamp: new Date(article.published),
                    metadata: {
                        region: article.region,
                        author: article.author
                    }
                });
            }
        }, UPDATE_TIME);
    },
    options: [{
        type: "chips",
        title: "Region",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.region.toLowerCase()) !== -1"
    }, {
        type: "chips",
        title: "Author",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.author.toLowerCase()) !== -1"
    }]
};
export default LoLEsportsWebsiteProvider;