import { Provider } from "../provider";
import { parse } from "feed-reader";
import slugify from "../util/slugify";

const UPDATE_TIME = 60 * 1000; // once a minute

const LeagueSoundcloudProvider: Provider<{}> = {
    slug: "league-soundcloud",
    name: "League of Legends Soundcloud",
    description: "Tracks all tracks posted on the official League of Legends Soundcloud.",
    icon: "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Soundcloud-128.png",
    async constructor(ctx) {
        setInterval(async () => {
            const data = await parse(`http://feeds.soundcloud.com/users/soundcloud:users:20172471/sounds.rss`);

            for (const entry of data.entries) {
                const id = slugify(entry.title);
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found a new soundcloud song: ${entry.title}`);
                ctx.emit({
                    id,
                    title: entry.title,
                    body: `<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURI(entry.link)}&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>`,
                    url: entry.link,
                    timestamp: new Date(entry.publishedDate)
                });
            }
        }, UPDATE_TIME);
    }
};
export default LeagueSoundcloudProvider;