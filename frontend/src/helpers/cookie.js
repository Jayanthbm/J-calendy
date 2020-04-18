export function createCookie(name, value, days) {
    let expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // ) removed
        expires = "; expires=" + date.toGMTString(); // + added
    }
    document.cookie = name + "=" + value + expires + ";path=/"; // + and " added
}

export function createCookieInMinutes(name, value, minutes) {
    let expires = "";
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + minutes * 60 * 1000); // ) removed
        expires = "; expires=" + date.toGMTString(); // + added
    }
    document.cookie = name + "=" + value + expires + ";path=/"; // + and " added
}

export function getCookie(cookieName) {
    let match = document.cookie.match(new RegExp(cookieName + `=([^;]+)`));
    if (match) return match[1];
}

export function deleteCookie(cookieName) {
    document.cookie =
        cookieName + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
export function getCookieValue(name) {
    var b = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");

    return b ? b.pop() : "";
}