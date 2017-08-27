import { Provider } from "../provider";
import { parse } from "feed-reader";
import slugify from "../util/slugify";

const REGIONS: [string, string][] = [
    ["euw", "en"],
    ["na", "en"],
    ["oce", "en"],
    ["eune", "en"],
    ["tr", "tr"],
    ["lan", "es"],
    ["las", "es"],
    ["br", "pt"],
    ["jp", "ja"],
    ["ru", "ru"]
];

const UPDATE_TIME = 60 * 1000; // once a minute

const LeagueOfLegendsWebsiteProvider: Provider<{}> = {
    slug: "leagueoflegends-website",
    name: "League of Legends Website",
    description: "Tracks all posts on all regions of leagueoflegends.com.",
    icon: "https://i.imgur.com/aC7plOV.png",
    constructor(ctx) {
        const updateRegion = async ([region, lang]: [string, string]) => {
            const data = await parse(`https://${region}.leagueoflegends.com/${lang}/rss.xml`);

            for (const entry of data.entries.reverse()) {
                const id = region + "_" + slugify(entry.link);
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found entry ${entry.title} on ${region}`);
                ctx.emit({
                    id,
                    title: `[${region.toUpperCase()}] ${entry.title}`,
                    url: entry.link,
                    body: `<i>No inline article.</i>`,
                    timestamp: new Date(entry.publishedDate),
                    metadata: {
                        region,
                        language: lang,
                        author: entry.author
                    }
                });
            }
        };

        // Distribute regions over our update time so we don't suddenly burst with updates.
        ctx.setDistributedInterval(REGIONS, updateRegion, UPDATE_TIME);
    },
    options: [{
        type: "chips",
        title: "Languages",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.language.toLowerCase()) !== -1"
    }, {
        type: "chips",
        title: "Authors",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.author.toLowerCase()) !== -1"
    }, {
        type: "chips",
        title: "Regions",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.region.toLowerCase()) !== -1"
    }]
};
export default LeagueOfLegendsWebsiteProvider;