import { Provider } from "../provider";

const provider: Provider<{}> = {
    slug: "test",
    name: "Test Provider",
    description: "A provider that generates event every few seconds.",
    icon: "https://www.macro4.com/files/6914/5406/7359/macro4-icon-test-data-oe.png",
    async constructor(ctx) {

    }
};
export default provider;