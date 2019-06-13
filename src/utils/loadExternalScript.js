export default function loadExternalScript(url, callback) {
    if (!isMyScriptLoaded(url)) {
        const script = document.createElement('script');
        script.type = 'text/javascript';

        if (script.readyState) { // IE
            script.onreadystatechange = () => {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;

                    if (callback) {
                        callback();
                    }
                }
            };
        } else {
            script.onload = () => {
                if (callback) {
                    callback();
                }
            };
        }

        script.src = url;
        document.body.appendChild(script);
    }
}

function isMyScriptLoaded(url) {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length; i--;) {
        if (scripts[i].src === url) return true;
    }
    return false;
}
