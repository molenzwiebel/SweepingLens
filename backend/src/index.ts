import SweepingLens from "./lens";
import RedditRiotCommentProvider from "./providers/reddit-riot-comment-provider";
import LeagueOfLegendsWebsiteProvider from "./providers/leagueoflegends-website-provider";
import NexusWebsiteProvider from "./providers/nexus-website-provider";
import UniverseWebsiteProvider from "./providers/universe-website-provider";
import LoLEsportsWebsiteProvider from "./providers/lolesports-website-provider";

process.on("unhandledRejection", (err: Error) => {
    console.error("Unhandled rejection: ", err);
});

const lens = new SweepingLens();
lens.registerProvider(RedditRiotCommentProvider);
lens.registerProvider(LeagueOfLegendsWebsiteProvider);
lens.registerProvider(NexusWebsiteProvider);
lens.registerProvider(UniverseWebsiteProvider);
lens.registerProvider(LoLEsportsWebsiteProvider);
lens.startup(8888);