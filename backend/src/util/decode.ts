import { AllHtmlEntities } from "html-entities";

export default function decode(content: string): string {
    const entities = new AllHtmlEntities();

    // Some providers (boards) have nested encoded representations
    // (think of &amp;#x27). We just loop until we see no further change
    // to the source.
    while (true) {
        const decoded = entities.decode(content);
        if (decoded === content) break;
        content = decoded;
    }

    return content;
}