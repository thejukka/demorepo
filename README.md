# demorepo

Täällä demoja esim. hybridisoftasta, eli:

* WebApp -kansiossa on itse websofta, joka rakentaa dynaamisen käyttöliittymän ja kommunikoi palvelimen kanssa.
* Android -kansiossa on Android -sovellus, joka lataa web-käyttöliittymän ja lukiessaan NFC-kortin kirjaa käyttäjän järjestelmään ja statuksen mukaan eri valikoihin.

WebApp hyödyntää perus oliopohjaista JavaScriptiä ja HTML5+CSS.

Android -softa on ns. "kioskisovellus", eli se pyrkii piiloittamaan järjestelmäfunktiot ja lukitsee ohjelman niin, ettei peruskäyttäjä pääse sitä sammuttamaan.

# in english

Heres a demo about my Web/Android "hybrid app", which containts two folders:

* "WebApp" includes the web app, which builds up a dynamic user interface to communicate with the server. Once the interface is loaded, rest of the communication is JSON-data between the server and the app.
* "Android" includes all needed source files for the Android app, which loads the URL and the user interface. After everything is set, the app reads an NFC-tag and if the current user is registered in the system, a menu is shown with choices, that are based on the user's current status.

The WebApp is written in object-oriented JavaScript and HTML5+CSS.

The Android app runs itself into so called "Kiosk mode", so it tends to prevent all system functions and lock down the system in the way, that a basic user won't be able to shut it down.
