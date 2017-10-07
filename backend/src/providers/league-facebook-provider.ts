import { Provider } from "../provider";
import fetch from "node-fetch";

const ACCOUNTS = [
    "LeagueOfLegends",
    "LeagueofLegendsHungary",
    "LeagueOfLegendsFROfficial",
    "LeagueOfLegendsSpain",
    "LeagueOfLegendsItaly",
    "LeagueofLegendsLatino",
    "LeagueOfLegendsRU",
    "LeagueOfLegendsPolska",
    "LeagueOfLegendsRomania",
    "LeagueOfLegendsDE",
    "LeagueOfLegendsEL",
    "LoLTurkiye",
    "LeagueOfLegendsBrasil",

    "RiotGames",
    "RiotGamesMerch"
];

interface FeedGraph {
    data: {
        message?: string;
        story?: string;
        created_time: string;
        id: string;
    }[];
}

const UPDATE_TIME = 30 * 1000; // every 30 seconds

const LeagueFacebookProvider: Provider<{ accessToken: string }> = {
    slug: "league-facebook",
    name: "League of Legends Facebook",
    description: "Tracks all Facebook posts published by official League facebook accounts.",
    icon: "https://cdn1.iconfinder.com/data/icons/logotypes/32/facebook-128.png",
    async constructor(ctx) {
        if (!ctx.data.accessToken) throw new Error("No facebook access token specified.");

        const updateAccount = async (account: string) => {
            const dataReq = await fetch(`https://graph.facebook.com/${account}/posts?access_token=${ctx.data.accessToken}`);
            const data: FeedGraph = await dataReq.json();

            for (const entry of data.data.reverse()) {
                if (!entry.message && !entry.story) continue;
                if (await ctx.hasEvent(entry.id)) continue;

                const postId = entry.id.split("_")[1];

                const oembedReq = await fetch(`https://www.facebook.com/plugins/post/oembed.json/?url=https%3A%2F%2Fwww.facebook.com%2F${account}%2Fposts%2F${postId}`);
                const oembed: { html: string } = await oembedReq.json();

                ctx.log(`Found new Facebook post from ${account}: ${entry.story || entry.message}`);
                ctx.emit({
                    id: entry.id,
                    title: `[${account}] ${entry.story || entry.message}`,
                    body: oembed.html,
                    url: `https://www.facebook.com/${account}/posts/${postId}`,
                    timestamp: new Date(entry.created_time),
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
export default LeagueFacebookProvider;