import { Provider } from "../provider";
import { parse } from "feed-reader";

const UPDATE_TIME = 60 * 1000; // once a minute

const LeagueInstagramProvider: Provider<{}> = {
    slug: "league-instagram",
    name: "League of Legends Instagram",
    description: "Tracks all images posted on the official League of Legends Instagram accounts.",
    icon: "http://www.iconsalot.com/asset/icons/unknown/social-network-logo-collection/128/instagram.png",
    async constructor(ctx) {
        setInterval(async () => {
            const data = await parse(`http://instatom.freelancis.net/leagueoflegends`);

            for (const entry of data.entries) {
                const [, id] = /p\/(.*)\/$/.exec(entry.link)!;
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found a new instagram post: ${entry.title}`);
                ctx.emit({
                    id,
                    title: entry.title,
                    body: entry.content,
                    url: entry.link,
                    timestamp: new Date(entry.publishedDate)
                });
            }
        }, UPDATE_TIME);
    }
};
export default LeagueInstagramProvider;