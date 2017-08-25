import { Provider } from "../provider";

const provider: Provider<{}> = {
    slug: "test",
    name: "Test Provider",
    description: "A provider that generates event every few seconds.",
    icon: "https://www.macro4.com/files/6914/5406/7359/macro4-icon-test-data-oe.png",
    async constructor(ctx) {
        let i = 0;
        while (await ctx.hasEvent("" + (i++)));

        setInterval(() => {
            ctx.log("Generating event");

            ctx.emit({
                id: "" + (i++),
                title: "Test Event " + i,
                url: "https://google.com/" + i,
                body: "<b>Test <i>Event</i></b> #" + i
            });
        }, 5000);
    }
};
export default provider;