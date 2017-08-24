function genCharArray() {
    var a = [], i = "A".charCodeAt(0), j = "Z".charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
