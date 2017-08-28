import { Provider } from "../provider";
import { parse } from "feed-reader";
import fetch from "node-fetch";

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

const UPDATE_TIME = 30 * 1000; // every 30 seconds

const LeagueTwitterProvider: Provider<{}> = {
    slug: "league-twitter",
    name: "League of Legends Tweets",
    description: "Tracks all tweets by official League of Legends twitter accounts.",
    icon: "https://cdn1.iconfinder.com/data/icons/logotypes/32/twitter-128.png",
    async constructor(ctx) {
        const updateAccount = async (account: string) => {
            const data = await parse(`https://twitrss.me/twitter_user_to_rss/?user=${account}`);

            for (const entry of data.entries.reverse()) {
                const [, id] = /\/status\/(\d+)/.exec(entry.link)!;
                if (await ctx.hasEvent(id)) continue;

                const oembedReq = await fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(entry.link)}`);
                const oembed: { html: string } = await oembedReq.json();

                ctx.log(`Found new Tweet from @${account}: ${entry.contentSnippet}`);
                ctx.emit({
                    id,
                    title: `[@${account}] ${entry.title.replace(/\n/g, " ")}`,
                    body: oembed.html,
                    url: entry.link,
                    timestamp: new Date(entry.publishedDate),
                    metadata: {
                        account
                    }
                });
            }
        };

        ctx.setDistributedInterval(ACCOUNTS, updateAccount, UPDATE_TIME);
    },
    options: [{
        type: "chips",
        title: "Account",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.account.toLowerCase()) !== -1"
    }]
};
export default LeagueTwitterProvider;