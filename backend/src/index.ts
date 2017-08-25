import SweepingLens from "./lens";
import RedditRiotCommentProvider from "./providers/reddit-riot-comment-provider";

const lens = new SweepingLens();
lens.registerProvider(RedditRiotCommentProvider);
lens.startup(8888);