import { Provider } from "../provider";
import fetch from "node-fetch";

/**
 * Incomplete definition of the json that reddit returns.
 */
interface RedditCommentsJson {
    data: {
        children: {
            id: string;
            author: string;
            author_flair_css_class?: string;
            body: string;
            link_title: string;
            created_utc: number;
            link_permalink: string;
        }[];
    }
}

const RedditRiotCommentProvider: Provider<{}> = {
    slug: "reddit-riot-comments",
    name: "Reddit Riot Comments",
    description: "Aggregates all comments posted on Reddit by accounts with a Riot flair (confirmed Rioters). Limited to /r/leagueoflegends.",
    icon: "http://www.programwitherik.com/content/images/2016/07/reddit.png",
    constructor(ctx) {
        setInterval(async () => {
            const req = await fetch("https://www.reddit.com/r/leagueoflegends/comments.json?limit=100");
            const data: RedditCommentsJson = await req.json();

            for (const comment of data.data.children) {
                if (!comment.author_flair_css_class || comment.author_flair_css_class.indexOf("riot") === -1) continue;
                if (await ctx.hasEvent(comment.id)) continue;

                ctx.log("Found new comment by", comment.author, "on", comment.link_title);
                ctx.emit({
                    id: comment.id,
                    title: `Comment on '${comment.link_title}' by /u/${comment.author}`,
                    url: comment.link_permalink,
                    body: comment.body,
                    timestamp: new Date(comment.created_utc * 1000),
                    metadata: {
                        author: comment.author
                    }
                });
            }
        }, 2 * 60 * 1000);
    }
};
export default RedditRiotCommentProvider;