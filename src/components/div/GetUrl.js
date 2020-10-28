function GetUrl() {
    var domain = window.location.href.split("://");

    var url = "https://trading-server.bjos19.me/";

    if (domain[1].includes("localhost") ||
        domain[1].includes("127.0.0.1")) {
        url = "http://localhost:8383/";
    }
    return url;
}

export default GetUrl;
