const fs = require("fs");
const request = require("request");

const PAGES = 50;


var successCount = 0;
for (var i = 1; i < PAGES; i++) {
    (function (i) {
        setTimeout(function () {
            request("http://api.mineskin.org/get/list/" + i + "?size=16", function (err, res, body) {
                body = JSON.parse(body);
                console.log("Parsing page #" + body.page.index + "...");

                body.skins.forEach(function (value) {
                    setTimeout(function () {
                        console.log("[P" + body.page.index + "] Loading Skin #" + value.id);
                        request(value.url).on("error", function (err) {
                            console.log(err);
                        }).pipe(fs.createWriteStream('output/' + value.id + "_skin.png")).on("finish", function () {
                            successCount++;
                        });
                    }, 500 * body.page.index);
                })
            });

            console.log("  " + successCount + " DOWNLOADED")
        }, 2000 * i)
    })(i);
}

console.log("  " + successCount + " DOWNLOADED IN TOTAL")