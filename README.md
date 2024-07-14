# DB-Projekt
Medieninformatik Projekt Modul MI Datenbankbasierte Webanwendungen

Minitutorial zur ausführung des projekts und servers
MySQL Workbench sowohl als auch MySQL Server müssen installiert werden,
da die Datenbank local laufen muss.   
1. In MySQL Workbench muss zunächst eineneue Connection erstellt werden, 
und der verwendete Passwort muss in die server.js datei, zeile 14 Angegeben werden.
2. Zur initialisierung der Datenbank, nach dem öffnen der Connection muss man in die
oberste menüleiste auf Server -> Daten Import gehen, dann den Dumpfolder importieren.
3. Mann cloned die gitReposetory DB-Projekt auf sein Rechner, öffnet den Ordner mit
Visual Studio Code. Nachdem man im terminal zu den DatenbankenProjekt ordner navigiert hat
kann mann  mit dem Kommando 'node server.js' den Server starten, und ab da wird die seite
über  http://localhost:8080/ verfügbar sein.

FALLS IRGENDWELCHE IMPORTS FEHLEN, sollten die meisten durch das kommando 'npm install' heruntergeladen werden
zusätzlich können 'npm install jsonwebtoken', 'ng add @angular/material', 
