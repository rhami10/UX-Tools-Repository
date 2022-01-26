import { defaultImage } from "./globals.js";

export function IsImageSpecified(obj) {
    return (obj.hasOwnProperty("image") && obj.image !== "");
}

export function GetBookmarkText(obj) {
    return obj.title;
}

export function GetBookmarkImageLink(obj) {
    return IsImageSpecified(obj) ? obj.image : defaultImage;
}

export function HasClassIncludeParents (child, classname) {
    if ($(child).hasClass(classname)) return true;
    return child.parentElement && HasClassIncludeParents(child.parentElement, classname);
}

export function OpenAllLinks(bookmarks, subcategory) {
    if (window.confirm("Are you sure?")) {
        bookmarks.forEach(bookmark => {
            if (bookmark.subcategory == subcategory) window.open(bookmark.link, "_blank")
        });
    }
}