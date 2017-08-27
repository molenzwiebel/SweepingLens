import { Provider } from "../provider";
import fetch from "node-fetch";

/**
 * Incomplete definition of the json that reddit returns.
 */
interface RedditCommentsJson {
    data: {
        children: {
            kind: string;
            data: {
                id: string;
                author: string;
                author_flair_css_class?: string;
                body: string;
                link_title: string;
                created_utc: number;
                link_permalink: string;
            };
        }[];
    }
}

const RedditRiotCommentProvider: Provider<{}> = {
    slug: "reddit-riot-comments",
    name: "Reddit Riot Comments",
    description: "Aggregates all comments posted on Reddit by accounts with a Riot flair (confirmed Rioters). Limited to /r/leagueoflegends.",
    icon: "http://www.programwitherik.com/content/images/2016/07/reddit.png",
    constructor(ctx) {
        ctx.setInterval(async () => {
            const req = await fetch("https://www.reddit.com/r/leagueoflegends/comments.json?limit=1000");
            const data: RedditCommentsJson = await req.json();

            for (const { data: comment } of data.data.children.reverse()) {
                if (!comment.author_flair_css_class || comment.author_flair_css_class.indexOf("riot") === -1) continue;
                if (await ctx.hasEvent(comment.id)) continue;

                const url = comment.link_permalink + comment.id;
                const oembedReq = await fetch(`https://www.reddit.com/oembed?url=${encodeURIComponent(url)}&parent=true`);
                const oembed: { html: string } = await oembedReq.json();

                ctx.log("Found new comment by", comment.author, "on", comment.link_title);
                ctx.emit({
                    id: comment.id,
                    title: `Comment on '${comment.link_title}' by /u/${comment.author}`,
                    url,
                    body: oembed.html,
                    timestamp: new Date(comment.created_utc * 1000),
                    metadata: {
                        author: comment.author
                    }
                });
            }
        }, 60 * 1000);
    },
    options: [{
        type: "chips",
        title: "Author",
        filter: "value.map(x => x.toLowerCase()).indexOf(event.metadata.author.toLowerCase()) !== -1"
    }]
};
export default RedditRiotCommentProvider;