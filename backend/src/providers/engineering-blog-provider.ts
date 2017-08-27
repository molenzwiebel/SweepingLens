import { Provider } from "../provider";
import { parse } from "feed-reader";
import slugify from "../util/slugify";

const UPDATE_TIME = 60 * 1000; // once a minute

const EngineeringBlogProvider: Provider<{}> = {
    slug: "engineering-blog",
    name: "Engineering Blog Articles",
    description: "Tracks all articles posted on engineering.riotgames.com",
    icon: "https://engineering.riotgames.com/sites/all/themes/riot_games_engineering/images/icons/apple-icon-57x57.png",
    async constructor(ctx) {
        ctx.setInterval(async () => {
            const data = await parse(`https://engineering.riotgames.com/rss.xml`);

            for (const entry of data.entries.reverse()) {
                const id = slugify(entry.title);
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found a new engineering article: ${entry.title}`);
                ctx.emit({
                    id,
                    title: entry.title,
                    body: entry.content,
                    url: entry.link,
                    timestamp: new Date(entry.publishedDate),
                    metadata: {
                        author: entry.author
                    }
                });
            }
        }, UPDATE_TIME);
    },
    options: [{
        type: "chips",
        title: "Authors",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.author.toLowerCase()) !== -1"
    }]
};
export default EngineeringBlogProvider;