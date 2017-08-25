import { Provider } from "../provider";
import { parse } from "feed-reader";

const ACCOUNTS = [
    "lolesports"
];

const UPDATE_TIME = 60 * 1000; // once a minute

const LoLEsportsTwitterProvider: Provider<{}> = {
    slug: "lolesports-twitter",
    name: "LoLEsports Tweets",
    description: "Tracks all tweets by official LoLEsports Twitter accounts.",
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
export default LoLEsportsTwitterProvider;