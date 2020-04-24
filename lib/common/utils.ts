const JSON5 = require("json5");
const fse = require("fs-extra");

module.exports = {
    /**
     * Create a folder by path
     *
     * @param {string} path
     */
    createDir(path: string) {
        fse.mkdirsSync(path, function (err: any) {
            if (err) {
                console.error(err);
            }
        });
    },

    copyFile(source: string, target: string) {
        const rd = fse.createReadStream(source);
        rd.on("error", () => { });
        const wr = fse.createWriteStream(target);
        wr.on("error", () => { });
        wr.on("finish", () => { });
        rd.pipe(wr);
    },

    /**
     * Get the json5 content
     *
     * @param {string} pathname
     */
    getJSON5ConfigByPath(pathname: string) {
        try {
            return JSON5.parse(fse.readFileSync(pathname).toString());
        } catch (err) {
            console.error(`Error loading config ${pathname} ${err}`);
            process.exit(9);
        }
    },

    generateUUID() {
        let d = new Date().getTime();
        const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
};
