import { Provider } from "../provider";
import loadRedTracker from "../util/redtracker";
import slugify from "../util/slugify";

const REGIONS = [
    "euw",
    "oce",
    "na"
];

const UPDATE_TIME = 60 * 1000; // once a minute

const BoardsRiotPostProvider: Provider<{}> = {
    slug: "boards-riot-post",
    name: "Boards Riot Posts",
    description: "Tracks all posts made by Rioters across all English boards.",
    icon: "https://i.imgur.com/aC7plOV.png",
    async constructor(ctx) {
        const buildLoader = (region: string) => async () => {
            const entries = await loadRedTracker(region);

            for (const article of entries) {
                if (article.isComment) continue;

                const id = slugify(article.link);
                if (await ctx.hasEvent(id)) continue;

                ctx.log("Found new Riot board article: " + article.title);
                ctx.emit({
                    id,
                    title: article.title,
                    url: article.link,
                    body: article.body,
                    timestamp: article.timestamp,
                    metadata: {
                        region,
                        author: article.author
                    }
                });
            }
        };

        // Distribute regions over our update time so we don't suddenly burst with updates.
        let offset = 0;
        for (const region of REGIONS) {
            setTimeout(() => {
                setInterval(buildLoader(region), UPDATE_TIME);
            }, offset);
            offset += UPDATE_TIME / REGIONS.length;
        }
    }
};
export default BoardsRiotPostProvider;