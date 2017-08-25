import SweepingLens from "./lens";
import TestProvider from "./providers/test-provider";

const lens = new SweepingLens();
lens.registerProvider(TestProvider);
lens.startup(8888);