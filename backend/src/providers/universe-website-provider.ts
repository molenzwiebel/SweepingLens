import { Provider } from "../provider";
import fetch from "node-fetch";
import slugify from "../util/slugify";

/**
 * Incomplete typings of the data returned from the universe meeps endpoint.
 */
interface UniverseMeeps {
    "latest-modules": {
        type: string;
        title: string;
        description: string;
        "story-slug"?: string;
        url?: string;
    }[];
}

const UPDATE_TIME = 60 * 1000; // once a minute

const UniverseWebsiteProvider: Provider<{}> = {
    slug: "universe-website",
    name: "universe.leagueoflegends.com entry",
    description: "Tracks all latest entries on the League of Legends universe portal (universe.leagueoflegends.com).",
    icon: "https://i.imgur.com/aC7plOV.png",
    constructor(ctx) {
        setInterval(async () => {
            const req = await fetch("http://universe-meeps.leagueoflegends.com/v1/en_us/explore/index.json");
            const data: UniverseMeeps = await req.json();

            for (const module of data["latest-modules"]) {
                const id = slugify(module.title);
                if (await ctx.hasEvent(id)) continue;

                const url = module.type === "story-preview"
                    ? "http://universe.leagueoflegends.com/en_US/story/" + module["story-slug"]
                    : module.type === "link-out" ? module.url : "http://universe.leagueoflegends.com";

                ctx.log("Found new article " + module.title + " on Universe");
                ctx.emit({
                    id,
                    title: module.title,
                    url: url!,
                    body: module.description,
                    metadata: {
                        type: module.type
                    }
                });
            }
        }, UPDATE_TIME);
    }
};
export default UniverseWebsiteProvider;