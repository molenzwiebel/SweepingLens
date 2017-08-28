import { Provider } from "../provider";
import { parse } from "feed-reader";

// [account name, account id, if the content is english]
const ACCOUNTS: [string, string, boolean][] = [
    ["Riot Games", "UCJEGvSZnQ1pkVfHO8s5G8hA", true],
    ["Riot Games Support", "UCyi6e6vg93m0VUyI05PGgow", true],
    ["League of Legends", "UC2t5bjwHdUX4vM2g8TRDq5g", true],
    ["League of Legends Community", "UCxqlOPlFDqMxWCYntmLCwzg", true],
    ["League of Legends - Turkey", "UCrh24N5HpJ_MXpIfcI7znlQ", false],
    ["League of Legends - Brazil", "UC6Xqz2pm50gDCORYztqhDpg", false],
    ["League of Legends - Latino", "UCmvoPMHe9l0ytr9ONu5-1vw", false],
    ["League of Legends - Russia", "UCgSPTEKkw5LT-PvdFO6FOuQ", false],
    ["League of Legends - Oceania", "UCJ6EyrObjc396m3MToJhblQ", false],
    ["League of Legends - Spain", "UC--ZPnXHsS_2hbHWrzgg1GQ", false],
    ["League of Legends - Germany", "UCZhTCQiHQzyzPa78qASRooA", false],
    ["League of Legends - Romania", "UC8bAJL54pjWHayyxrsAOo2Q", false],
    ["League of Legends - Greece", "UC1vQzYlq4ecWBcFe0vh50Rg", false],
    ["League of Legends - Poland", "UC6yuFHuoNYgYABOHYbwQk4w", false],
    ["League of Legends - France", "UCU-l1ajszDLFd6lWyCs1_GA", false],
    ["League of Legends - Italia", "UC_aku-WGRZyQJ9QyaYMNyrw", false],
    ["League of Legends - Hungary", "UC4NPWtnzf_wE5bIGGDT4igw", false],
    ["EU League Community", "UC4KvdihNRDcMx_yoaFE4tEg", true],
];

const UPDATE_TIME = 30 * 1000; // every 30 seconds

const LeagueYoutubeProvider: Provider<{}> = {
    slug: "league-youtube",
    name: "League of Legends Youtube",
    description: "Tracks all videos by official League of Legends youtube accounts.",
    icon: "http://icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png",
    async constructor(ctx) {
        const buildLoader = async ([name, account, english]: [string, string, boolean]) => {
            const data = await parse(`https://www.youtube.com/feeds/videos.xml?channel_id=${account}`);

            for (const entry of data.entries.reverse()) {
                const [, id] = /\?v=(.*)$/.exec(entry.link)!;
                if (await ctx.hasEvent(id)) continue;

                ctx.log(`Found new Video from ${name}: ${entry.title}`);
                ctx.emit({
                    id,
                    title: `[${name}] ${entry.title}`,
                    body: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`,
                    url: entry.link,
                    timestamp: new Date(entry.publishedDate),
                    metadata: {
                        english: english,
                        account: name,
                        account_id: account
                    }
                });
            }
        };

        ctx.setDistributedInterval(ACCOUNTS, buildLoader, UPDATE_TIME);
    },
    options: [{
        type: "checkbox",
        title: "English Only",
        filter: "value ? event.metadata.english : true"
    }, {
        type: "chips",
        title: "Accounts",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.account.toLowerCase()) !== -1"
    }]
};
export default LeagueYoutubeProvider;