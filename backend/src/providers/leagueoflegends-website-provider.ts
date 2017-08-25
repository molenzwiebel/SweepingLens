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
    name: "leagueoflegends.com news",
    description: "Tracks all posts on all regions of leagueoflegends.com.",
    icon: "https://i.imgur.com/aC7plOV.png",
    constructor(ctx) {
        const buildLoader = (region: string, lang: string) => async () => {
            const data = await parse(`https://${region}.leagueoflegends.com/${lang}/rss.xml`);

            for (const entry of data.entries) {
                const id = region + "_" + slugify(entry.link);
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found entry ${entry.title} on ${region} (id will be '${id}')`);
                ctx.emit({
                    id,
                    title: `[${region.toUpperCase()}] ${entry.title}`,
                    url: entry.link,
                    body: entry.content,
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
        let offset = 0;
        for (const [region, lang] of REGIONS) {
            setTimeout(() => {
                setInterval(buildLoader(region, lang), UPDATE_TIME);
            }, offset);
            offset += UPDATE_TIME / REGIONS.length;
        }
    }
};
export default LeagueOfLegendsWebsiteProvider;