[![license](https://img.shields.io/github/license/TobitSoftware/chayns-web-light.svg)](./LICENSE) [![GitHub pull requests](https://img.shields.io/github/issues-pr/TobitSoftware/chayns-web-light.svg)](../../pulls) [![](https://img.shields.io/github/issues-pr-closed-raw/TobitSoftware/chayns-web-light.svg)](../../pulls?q=is%3Apr+is%3Aclosed)

## ChaynsWebLight
The ChaynsWebLight is an standalone runtime environment for chayns tapps.  
It self has no User Interface, it displays only the tapp content.

Take a look at the repository wiki for more information.


#### Installation
1. Clone this repository
2. Run <code>npm i</code>

> If you have no access to the internal tobit.software npm server you need to remove/replace the usage of the package `chayns-logger`.

#### DevServer
1. Run `npm start` to fire up the dev server
2. Open `https://localhost:7070`

> To use a SSL certificate you can create a ssl.crt and a ssl.key file under webpack/ssl

> Run `npm run start:http` to fire up the dev server on `http://` instead of `https://`
