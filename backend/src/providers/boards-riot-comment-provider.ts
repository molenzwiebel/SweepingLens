import { Provider } from "../provider";
import loadRedTracker from "../util/redtracker";
import slugify from "../util/slugify";

const REGIONS = [
    "euw",
    "oce",
    "na"
];

const UPDATE_TIME = 60 * 1000; // once a minute

const BoardsRiotCommentProvider: Provider<{}> = {
    slug: "boards-riot-comment",
    name: "Boards Riot Comments",
    description: "Tracks all comments made by Rioters across all English boards.",
    icon: "https://i.imgur.com/aC7plOV.png",
    async constructor(ctx) {
        const buildLoader = (region: string) => async () => {
            const entries = await loadRedTracker(region);

            for (const comment of entries) {
                if (!comment.isComment) continue;

                const id = slugify(comment.link);
                if (await ctx.hasEvent(id)) continue;

                ctx.log("Found new Riot board comment.");
                ctx.emit({
                    id,
                    title: "Comment by " + comment.author + " on " + comment.title,
                    url: comment.link,
                    body: comment.body,
                    timestamp: comment.timestamp,
                    metadata: {
                        region,
                        author: comment.author
                    }
                });
            }
        };

        // Distribute regions over our update time so we don't suddenly burst with updates.
        let offset = 0;
        for (const region of REGIONS) {
            setTimeout(() => {
                ctx.setInterval(buildLoader(region), UPDATE_TIME);
            }, offset);
            offset += UPDATE_TIME / REGIONS.length;
        }
    }
};
export default BoardsRiotCommentProvider;