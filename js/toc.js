function createToc(pages) {
    let tocContent = $(`<div>
        <h2><span class="header">Table of contents</span></h2>
    </div>`);
    for (let pageNumber = 0; pageNumber < pages.length; pageNumber++) {
        let i = pages[pageNumber];
        if (pageNumber === 0) continue;
        let element = $(i.pagebox);

        let mainArea = element.children("div.pagedjs_area");
        let pagedContentArea = mainArea.children("div.pagedjs_page_content").children("div");
        let chapterTitle = pagedContentArea.find("span.emu-chapter-name");
        if (!chapterTitle.length) continue; // We're on a page without a title

        let bodyArea = pagedContentArea.children("div.emu-body-container");

        tocContent.append(`
        <div class="emu-toc-row">
            <strong>${chapterTitle.text()}</strong>
            <span class="emu-toc-sep"></span>
           <a href="#page-${pageNumber + 1}">${pageNumber + 1}</a>
        </div>
        `);

        // Go into the body area
        for (let bodyNode of bodyArea.find("span.header-text")) {
            let node = $(bodyNode);
            const parentNodeName = node.parent().parent().prop("tagName");
            if (parentNodeName === "H2") {
                tocContent.append(`
                <div class="emu-toc-row">
                    <span class="emu-toc-tab"></span>
                    ${node.text()}
                    <span class="emu-toc-sep"></span>
                    <a href="#page-${pageNumber + 1}">${pageNumber + 1}</a>
                </div>`);
            } else if (parentNodeName === "H3") {
                tocContent.append(`
                <div class="emu-toc-row">
                    <span class="emu-toc-tab"></span>
                    <span class="emu-toc-tab"></span>
                    ${node.text()}
                    <span class="emu-toc-sep"></span>
                    <a href="#page-${pageNumber + 1}">${pageNumber + 1}</a>
                </div>`);
            }
        }
    }

    $("#emu-toc").append(tocContent);
}

class handlers extends Paged.Handler {
    constructor(chunker, polisher, caller) {
        super(chunker, polisher, caller);
    }

    afterPreview(content) {
        createToc(content);
    }
}

Paged.registerHandlers(handlers);