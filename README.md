# TraceClaire v0.10 — version web pour GitHub Pages

Adaptation de TraceClaire v0.9 Windows. Application HTML/JavaScript sans serveur Python ni installation de dépendances.

## Publication

1. Décompresser l'archive.
2. Dans le dépôt GitHub `traceclaire`, choisir **Add file → Upload files**.
3. Importer `index.html`, `storage.js` et ce `README.md` directement à la racine (pas le ZIP, ni un dossier parent).
4. Valider avec **Commit changes**.
5. Dans **Settings → Pages**, choisir **Deploy from a branch**, branche **main**, dossier **/(root)**, puis **Save**.
6. Attendre la fin du déploiement et ouvrir l'adresse indiquée dans Pages. Si la publication échoue, consulter l'onglet Actions.

Ne jamais déposer ses voyages ou médias personnels dans le dépôt public.

## Utilisation

1. Cliquer sur **Créer un voyage** et lui donner un nom.
2. Importer les GPX/OSF, puis les photos JPG et vidéos MP4/MOV/WEBM.
3. Vérifier les positions, pauses, nuits et détours avant d'exporter un GPX nettoyé.
4. Cliquer sur **Enregistrer sur cet appareil** et attendre la confirmation.
5. Après réouverture du site, choisir le voyage et cliquer sur **Ouvrir ce voyage**.
6. Pour une copie indépendante ou un transfert vers un autre appareil, laisser **Inclure photos et vidéos** coché et utiliser **Enregistrer le voyage** dans la section Projet de voyage. Le fichier téléchargé est une archive `.traceclaire` réimportable avec **Ouvrir un voyage**.

## Stockage et limites

- La bibliothèque utilise IndexedDB dans le profil du navigateur, pas un dossier Windows et pas GitHub. Les données ne sont pas synchronisées entre appareils. Utiliser l'adresse publiée en HTTPS, pas un double-clic sur le HTML.
- La sauvegarde est manuelle. Effacer les données du site, supprimer le profil navigateur ou utiliser la navigation privée peut entraîner une perte. Garder les originaux et des archives indépendantes.
- Le quota dépend de l'appareil et du navigateur. Une demande de stockage persistant est faite à l'enregistrement, mais son acceptation n'est pas garantie. Les grosses vidéos et exports ZIP peuvent dépasser la mémoire disponible : commencer par un petit voyage.
- Cette version ouvre un voyage à la fois. La carte globale de tous les voyages, les miniatures optimisées, le HEIC, les doublons et la synchronisation restent à développer. Ce n'est pas encore une version finale validée pour des centaines de voyages.
- Les projets `.traceclaire` du format d'archive version 1 sont acceptés. Les dossiers `Voyages/.../project.json` de la version Windows ne sont pas importés directement. Conserver la version Windows et ses fichiers jusqu'à migration vérifiée.
- Internet est nécessaire pour charger Leaflet/JSZip depuis leurs CDN et pour les fonds OSM/Esri. Pas de PWA ou de fonctionnement hors connexion ajouté dans cette version.
- La recherche publique de POI utilise les fournisseurs directement depuis le navigateur. Leur disponibilité, les limites et les règles CORS peuvent provoquer une erreur. Geoapify requiert votre clé, transmise uniquement à son API et non enregistrée dans le projet. Les coordonnées recherchées sont transmises au fournisseur choisi. Les serveurs de cartes reçoivent les requêtes de tuiles de la zone affichée.
- MOV/MP4 : la lecture dépend des codecs pris en charge par le navigateur. La position par horaire dépend du fuseau choisi et des heures GPX.

## Vérifications effectuées

- Vérification de syntaxe des scripts JavaScript.
- Ouverture dans Chrome sans serveur Python.
- Création d'un voyage, import d'un GPX et d'une photo, sauvegarde dans IndexedDB, rechargement et restauration de la trace et de la photo.
- Création d'une archive avec médias jusqu'au message « Projet prêt ». La réimportation de cette archive, les vidéos, les services POI et le mobile restent à tester sur la version publiée.

## Mise à jour

Remplacer les fichiers de l'application sur la même branche : Pages republiera le site. Garder la même adresse pour retrouver la bibliothèque et exporter une sauvegarde avant les mises à jour.
