import fetch from "node-fetch";
import { load } from "cheerio";
import marked = require("marked");
import decode from "./decode";

interface RedTrackerEntry {
    link: string;
    title: string;
    author: string;
    timestamp: Date;
    body: string;
    isComment: boolean;
}

export default async function loadRedTracker(region: string): Promise<RedTrackerEntry[]> {
    const req = await fetch(`https://boards.${region}.leagueoflegends.com/en/redtracker`);
    const $ = load(await req.text());

    const entries: RedTrackerEntry[] = [];
    $(".redtracker-list-item").each(function () {
        const $$ = $(this);

        const link = `https://boards.${region}.leagueoflegends.com${$$.find(".title-link").attr("href")}`;
        const title = $$.find(".title-link").text();
        const author = $$.find(".author a").text();
        const timestamp = new Date($$.find(".timeago").attr("title"));
        const body = marked(decode($$.find(".markdown_content").html() || ""));
        const isComment = $$.find(".content.parent").length > 0;

        entries.push({ link, title, author, timestamp, body, isComment });
    });

    return entries;
}