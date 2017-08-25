import { Provider } from "../provider";
import { parse } from "feed-reader";

const ACCOUNTS = [
    "leagueoflegends",
    "riotgames",
    "loleu",
    "lolturkiye",
    "lollanoficial",
    "lolegendsbr",
    "lol_france",
    "lolgermany",
    "lol_spain",
    "lol_cis"
];

const UPDATE_TIME = 60 * 1000; // once a minute

const LeagueTwitterProvider: Provider<{}> = {
    slug: "league-twitter",
    name: "League of Legends Tweets",
    description: "Tracks all tweets by official League of Legends twitter accounts.",
    icon: "https://cdn1.iconfinder.com/data/icons/logotypes/32/twitter-128.png",
    async constructor(ctx) {
        const buildLoader = (account: string) => async () => {
            const data = await parse(`https://twitrss.me/twitter_user_to_rss/?user=${account}`);

            for (const entry of data.entries) {
                const [, id] = /\/status\/(\d+)/.exec(entry.link)!;
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found new Tweet from @${account}: ${entry.contentSnippet}`);
                ctx.emit({
                    id,
                    title: `[@${account}] ${entry.title.replace(/\n/g, " ")}`,
                    body: entry.content,
                    url: entry.link,
                    timestamp: new Date(entry.publishedDate),
                    metadata: {
                        account
                    }
                });
            }
        };

        let offset = 0;
        for (const account of ACCOUNTS) {
            setTimeout(() => {
                setInterval(buildLoader(account), UPDATE_TIME);
            }, offset);
            offset += UPDATE_TIME / ACCOUNTS.length;
        }
    }
};
export default LeagueTwitterProvider;