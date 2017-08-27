import SweepingLens from "./lens";
import RedditRiotCommentProvider from "./providers/reddit-riot-comment-provider";
import LeagueOfLegendsWebsiteProvider from "./providers/leagueoflegends-website-provider";
import NexusWebsiteProvider from "./providers/nexus-website-provider";
import UniverseWebsiteProvider from "./providers/universe-website-provider";
import LoLEsportsWebsiteProvider from "./providers/lolesports-website-provider";
import LeagueTwitterProvider from "./providers/league-twitter-provider";
import LoLEsportsTwitterProvider from "./providers/lolesports-twitter-provider";
import EngineeringBlogProvider from "./providers/engineering-blog-provider";
import LeagueSoundcloudProvider from "./providers/league-soundcloud-provider";
import LeagueInstagramProvider from "./providers/league-instagram-provider";
import BoardsRiotCommentProvider from "./providers/boards-riot-comment-provider";
import BoardsRiotPostProvider from "./providers/boards-riot-post-provider";
import LeagueYoutubeProvider from "./providers/league-youtube-provider";

process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled rejection: ", err);
});

const lens = new SweepingLens();

lens.registerProvider(RedditRiotCommentProvider);

lens.registerProvider(BoardsRiotPostProvider);
lens.registerProvider(BoardsRiotCommentProvider);

lens.registerProvider(LeagueOfLegendsWebsiteProvider);
lens.registerProvider(NexusWebsiteProvider);
lens.registerProvider(UniverseWebsiteProvider);

lens.registerProvider(LeagueTwitterProvider);
lens.registerProvider(LeagueSoundcloudProvider);
lens.registerProvider(LeagueInstagramProvider);
lens.registerProvider(LeagueYoutubeProvider);

lens.registerProvider(LoLEsportsWebsiteProvider);
lens.registerProvider(LoLEsportsTwitterProvider);

lens.registerProvider(EngineeringBlogProvider);

lens.startup(8888);