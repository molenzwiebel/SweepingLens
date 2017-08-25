import slug = require("slug");

export default function slugify(arg: string) {
    return slug(arg);
}