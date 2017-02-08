# ChaynsWebLight
Das ChaynsWebLight ist eine eigenständige Laufzeitumgebung für Chayns Tapps. 
Es hat selber keine Benutzeroberfläche sondern zeigt nur den beim Aufruf übergebenen Tapp an. 

##Usage

###URL's
[live](chayns2.tobit.com/ChaynsWebLight/) `https://chayns2.tobit.com/ChaynsWebLight/`

[QA](//chayns3.tobit.com/QA/ChaynsWebLight/) `https://chayns3.tobit.com/QA/ChaynsWebLight/`

###Parameter

|Name          |Wert                      | Default  |Bedeutung                                                                                                  |
|     :---:    |            :---:         |  :---:   |                                      :---:                                                                |
| locationId   | gültige LocationId       | 77783    | Die LocationId mit welche das CWL den Tapp laden soll.                                                    |
| tappId       | gültige TappId           | -2       | Die TappId des aufzurufenden Tapps. <fc #ff0000>Achtung:</fc> Tapp muss auf Location angelegt sein.       |
| navigation   | 1 = show, 0 = hide       | 0        | Blendet eine Navigation für die ChaynsId Tapps ein                                                        |
| accesstoken  | TobitAccessToken         | -        | Ermöglicht es beim Aufruf den Nutzer direkt einzuloggen (LocationId wird aus dem AccessToken übernommen)  |
| console      | 1 = eigene, 0 = Browser  | 0        | Überschreibt die Browser eigene Console und nutzt die CWL eigene Console                                  |
| debug        | 1 = show, 0 = hide       | 0        | Blendet die Navigation ein mit zusätlichen Icons zum wechseln zwischen Live, QA und Dev Version des CWL   |
| login        | 'dev', 'qa', 'live'      | 'live'   | Ermöglicht es die verschiedenen Versionen des Login Tapps zu laden                                    |

Fehlt beim Aufruf die LocationId oder die TappId läd das CWL neu mit den fehlenden URL Parametern und verwendet dort die default Values.

### Native Functions
The ChaynsWebLight uses the following native functions.
The CWL handles this functions, not the Tapp.

#### window.external (David Mac)
* window.external.chayns.getAccessToken();
* window.external.chayns.setAccessToken(accessToken);
* window.external.chayns.getKeyValue(key)
* window.external.chayns.putKeyValue(key, value)
* window.external.chayns.refreshChaynsId()
* window.external.window.close()
* window.external.window.resizeTo(x, y)

#### document.defaultView.external (Clipinc)
* document.defaultView.external.chayns.getAccessToken();
* document.defaultView.external.chayns.setAccessToken(accessToken);
* document.defaultView.external.chayns.getKeyValue(key);
* document.defaultView.external.chayns.putKeyValue(key, value);
* document.defaultView.external.chayns.refreshDisplay();
* document.defaultView.external.window.close();
* document.defaultView.external.window.resizeTo(x, y);

#### document.parentWindow.external (David Windows)
* document.parentWindow.external.Chayns.GetAccessToken()
* document.parentWindow.external.Chayns.SetAccessToken(accessToken);
* document.parentWindow.external.Chayns.GetKeyValue(key);
* document.parentWindow.external.Chayns.PutKeyValue(key, value);
* document.parentWindow.external.Chayns.RefreshDisplay();
* document.parentWindow.external.Window.Close();
* document.parentWindow.external.Window.ResizeTo(x, y);


##Development

#### Installation
1. Clone this repository
2. Run <code>npm i</code>
3. Run <code>npm start</code> to fire up the dev server
4. Open `http://localhost:7070`

#### Building
Use `npm run build` to build the project.