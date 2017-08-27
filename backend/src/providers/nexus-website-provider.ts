import { Provider } from "../provider";
import fetch from "node-fetch";
import { parseString } from "xml2js";

/**
 * Incomplete representation of the object received from using xml2js on the nexus xss feed.
 */
interface RSSItem {
    title: string;
    link: string;
    pubDate: string;
    "dc:creator": string | string[];
    category: string | string[];
    guid: {
        _: string; // unique url, can be used as id
    }
}

const UPDATE_TIME = 60 * 1000; // once a minute

const NexusWebsiteProvider: Provider<{}> = {
    slug: "nexus-website",
    name: "League of Legends Nexus",
    description: "Tracks all articles on the League of Legends nexus (nexus.leagueoflegends.com).",
    icon: "https://i.imgur.com/f4Kgttx.png",
    constructor(ctx) {
        ctx.setInterval(async () => {
            const req = await fetch("http://nexus.leagueoflegends.com/feed/");
            const xml = await new Promise<any>((resolve, reject) => {
                req.text().then(text => parseString(text, { explicitArray: false }, (err, res) => err ? reject(err) : resolve(res)));
            });

            for (const item of xml.rss.channel.item.reverse() as RSSItem[]) {
                const [, id] = /\?p=(\d+)/.exec(item.guid._)!;
                if (await ctx.hasEvent(id)) continue;

                ctx.log("Found new nexus article: " + item.title);
                ctx.emit({
                    id,
                    title: item.title,
                    url: item.link,
                    body: "<i>No inline article.</i>",
                    timestamp: new Date(item.pubDate),
                    metadata: {
                        authors: Array.isArray(item["dc:creator"]) ? item["dc:creator"] : [item["dc:creator"]],
                        categories: Array.isArray(item.category) ? item.category : [item.category],
                    }
                });
            }
        }, UPDATE_TIME);
    }
};
export default NexusWebsiteProvider;