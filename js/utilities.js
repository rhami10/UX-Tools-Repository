import { defaultImage } from "./globals.js";

export function IsImageSpecified(obj) {
    return (obj.hasOwnProperty("image") && obj.image !== "")
}

export function GetBookmarkText(obj) {
    return IsImageSpecified(obj) ? "" : ('<p>' + obj.title + '</p>')
}

export function GetBookmarkImageLink(obj) {
    return IsImageSpecified(obj) ? obj.image : defaultImage;
}

export function HasParentClass(child, classname) {
    if (child.className.split(' ').indexOf(classname) >= 0) return true;
    return child.parentElement && hasParentClass(child.parentElement, classname);
}