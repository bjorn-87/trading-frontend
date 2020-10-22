function GetUrl() {
    var domain = window.location.href.split("://");

    var url = "https://me-api.bjos19.me/";

    if (domain[1].includes("localhost") ||
        domain[1].includes("127.0.0.1")) {
        url = "http://localhost:1338/";
    }
    return url;
}

export default GetUrl;
