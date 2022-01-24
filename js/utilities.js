export default function IsImageSpecified(obj) {
    return (obj.hasOwnProperty("image") && obj.image !== "")
}

export default function GetBookmarkText(obj) {
    return isImageSpecified(obj) ? "" : ('<p>' + obj.title + '</p>')
}

export default function GetBookmarkImageLink(obj) {
    return isImageSpecified(obj) ? obj.image : defaultImage;
}

export default function HasParentClass(child, classname) {
    if (child.className.split(' ').indexOf(classname) >= 0) return true;
    return child.parentElement && hasParentClass(child.parentElement, classname);
}