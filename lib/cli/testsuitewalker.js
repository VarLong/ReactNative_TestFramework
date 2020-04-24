const klawSync = require("klaw-sync");
const path = require("path");
const fs = require("fs-extra");

function walk(tag, excludedCases, groupPath) {
    const tags = tag.toString()
        .replace(/\s/g, "")
        .split(",") || [],
        excludedCasesArr = excludedCases
            ? excludedCases
                .toString()
                .replace(/\s/g, "")
                .toLowerCase()
                .split(",")
            : [];
    const getAllFilteredTestPaths = function (paths, tags, excludedTestCases) {
        const testFilesMatchedTags = [];
        paths.forEach((path) => {
            const tagText = fs.readFileSync(path);
            const tagMatch = /Tags\s*=.*\]/.exec(tagText);
            let tagsOfTest = [];
            if (tagMatch && tagMatch[0]) {
                tagsOfTest = tagMatch[0].replace(/Tags\s*=|\]|\[|'|"|\s/g, "").split(",");
                tagsOfTest = tagsOfTest.map((t) => t.toLowerCase());
            }

            const match = tags.filter((tag) => tagsOfTest.indexOf(tag.toLowerCase()) > -1).length > 0;
            if (match) {
                testFilesMatchedTags.push(path);
            }
        });
        return testFilesMatchedTags;
    };

    try {
        const filterFn = (item) => {
            return (
                excludedCasesArr.indexOf(path.parse(item.path).name.toLowerCase()) < 0 &&
                path.extname(item.path) === ".js"
            );
        };
        let pathsObjs = [];
        if (groupPath) {
            const groupPaths = groupPath.split(",").map((gPath) => gPath.trim());
            groupPaths.forEach((gPath) => {
                gPath = gPath.replace(/\\/g, "/").replace(/artifacts|build/g, "..");
                console.log(`walker the group path ${gPath}`);
                const tempPathsObjs = klawSync(path.resolve(__dirname, gPath), { filter: filterFn });
                pathsObjs = pathsObjs.concat(tempPathsObjs);
            });
        } else {
            pathsObjs = klawSync(path.resolve(__dirname, "../../tests/"), { filter: filterFn });
        }
        const paths = pathsObjs.map((p) => p.path);
        return getAllFilteredTestPaths(paths, tags, excludedCasesArr);
    } catch (exception) {
        console.log("walking wrong way ? " + exception);
    }
}

module.exports = walk;
