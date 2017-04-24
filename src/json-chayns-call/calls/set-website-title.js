let defaultTitle = null;

export default function setWebsiteTitle(req, res) {
    if(defaultTitle === null){
        defaultTitle = document.title;
    }

    if (!req.value || !req.value.title) {
        document.title = defaultTitle;
        return;
    }

    document.title = req.value.title;
}
