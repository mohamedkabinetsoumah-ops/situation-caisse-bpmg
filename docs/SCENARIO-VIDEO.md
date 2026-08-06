# Vidéo de présentation — document de production

Scénario complet de l'application **Situation de Caisse**, en trois chapitres
autonomes : direction, caissières, informatique. Durée visée **9 à 10 minutes**,
chapitres marqués pour que chaque public aille droit à sa partie.

Ce document contient tout ce qu'il faut pour tourner sans hésiter : la
préparation, le déroulé écran par écran, et le texte à dire.

---

## Partie I — Préparation

### 1. Ne tournez pas sur les données du poste

**Une caisse vide ne démontre rien.** Un historique à une ligne et un comptage à
zéro donnent l'impression d'une maquette, pas d'un outil en service. Et filmer
les montants réels d'une agence est exclu.

Un jeu de démonstration complet est fourni : `docs/donnees-demonstration.json`.
Sept situations sur cinq jours, en trois devises, avec un écart volontaire pour
la scène du déficit. Personnes et montants entièrement fictifs.

**Avant de l'importer, sauvegardez ce que vous avez :**

1. *Paramètres → Exporter une sauvegarde (.json)* — mettez le fichier de côté.
2. *Paramètres → Importer une sauvegarde* — chargez `donnees-demonstration.json`.
3. Après le tournage, réimportez votre sauvegarde pour retrouver votre poste.

> **Pourquoi cet ordre.** L'import **remplace** l'historique et les paramètres,
> il ne les complète pas. Sans l'étape 1, ce que vous aviez saisi est perdu.

### 2. Ce qu'il ne faut jamais montrer

| À masquer | Pourquoi |
|---|---|
| La barre d'adresse `…github.io` | Elle révèle un hébergement sur un compte externe. **Filmez en mode application** : l'installeur, ou le bouton *Installer l'app*, ouvre une fenêtre sans barre d'adresse ni onglets. C'est le meilleur cadre. |
| Des montants de caisse réels | Données d'exploitation de la banque. |
| Les noms des caissières en poste | Personnes identifiables. Le jeu de démonstration utilise des noms inventés. |
| Les outils de développement (`F12`) | L'onglet *Application* affiche les données en clair. |
| Votre fenêtre de navigateur habituelle | Onglets, favoris, extensions : vie privée, et cela fait bricolage. |

### 3. Réglages techniques

- **Résolution 1920 × 1080**, zoom à 100 % (`Ctrl` + `0`).
- **Mode application** plutôt que navigateur — voir le tableau ci-dessus.
- **Mettez Windows en thème clair.** L'application suit le thème du système :
  en thème sombre, tous vos écrans seront sombres, et vos captures ne
  correspondront ni au support imprimé ni à la présentation PowerPoint.
- **Agrandissez le curseur** (Paramètres → Accessibilité) : sur une capture
  1080p redimensionnée, un curseur standard disparaît.
- **Coupez les notifications** — *Assistant de concentration* sur « Alarmes
  uniquement ».
- **Préparez une imprimante PDF** par défaut : la scène d'impression doit
  s'ouvrir sans boîte de dialogue parasite.
- **Enregistrez l'écran et la voix séparément.** On refait une phrase ratée
  sans retourner l'image.

### 4. Répétez le parcours une fois sans enregistrer

Deux scènes se préparent et ne s'improvisent pas :

- **La scène du déficit** (§ 1.3) : vous devez saisir sciemment une quantité
  fausse pour faire apparaître le bandeau rouge. Sachez d'avance quelle ligne
  vous modifiez et de combien.
- **La scène hors ligne** (§ 3.2) : coupez le Wi-Fi *avant* de lancer
  l'enregistrement de cette séquence, pas pendant.

---

## Partie II — Le déroulé

Les durées sont indicatives. Le texte est à dire, pas à lire mot à mot : gardez
le sens, prenez vos mots.

---

### Ouverture — 0:00 à 0:45

**À l'écran** : l'application ouverte sur *Saisie du jour*, logo BPMG visible en
haut à gauche. Immobile trois secondes.

> « Voici l'application Situation de Caisse de la Banque Populaire
> Maroco-Guinéenne. Elle sert à établir la situation de caisse quotidienne des
> agences : le comptage des espèces, le rapprochement avec le solde comptable,
> et le document signé en fin de journée.
>
> Elle remplace un fichier Excel, sans rien changer à la méthode de travail des
> caissières.
>
> Cette présentation se découpe en trois parties. La première montre ce que
> l'application apporte. La deuxième suit une journée de caisse, du matin à la
> clôture. La troisième s'adresse au service informatique. »

---

## CHAPITRE 1 — Ce que l'application apporte

*Public : direction, chefs d'agence, contrôle interne. Durée ≈ 3 min 20.*

### 1.1 Le point de départ — 0:45 à 1:15

**À l'écran** : ouvrez brièvement l'ancien fichier Excel, cinq secondes, puis
revenez à l'application.

> « Voici l'outil actuel. Il fait son travail depuis des années, et je ne le
> critique pas. Mais tout y repose sur la vigilance de la personne qui le
> remplit : les totaux par coupure, le solde, le montant en toutes lettres sont
> saisis à la main. Une erreur de frappe ne se voit pas. Une formule effacée par
> inadvertance non plus.
>
> L'application reprend exactement la même fiche, et calcule tout elle-même. »

### 1.2 Le comptage se calcule seul — 1:15 à 2:05

**À l'écran** : le tableau *Comptage physique*. Saisissez une quantité dans une
ligne vide — la coupure de 2 000, par exemple — et laissez le total se mettre à
jour.

> « La caissière compte ses billets comme avant. Elle saisit une seule chose :
> la quantité par coupure. Le montant de la ligne et le total de la caisse se
> calculent immédiatement. »

**Pointez** la ligne *Arrêté à la somme de* sous le tableau.

> « Et voici ce qui, aujourd'hui, s'écrit à la main : le montant en toutes
> lettres. Sur un document qui sera signé, c'est la mention qui fait foi en cas
> de contestation. L'application la génère à partir du total compté, avec
> l'orthographe correcte. Elle ne peut pas être en désaccord avec le chiffre
> puisqu'elle en découle. »

### 1.3 L'écart au moment où il se produit — 2:05 à 2:45

**À l'écran** : le bandeau vert **ÉQUILIBRE**. Modifiez alors une quantité pour
créer volontairement un manque — retirez quelques billets de 10 000.

> « Tant que la caisse est juste, le bandeau reste vert. »

**Laissez le bandeau passer au rouge.** Marquez un temps.

> « Dès que le compte physique s'écarte du solde comptable, l'application le dit,
> à l'instant même où la saisie se fait, avec le montant exact du manque.
>
> C'est la différence de fond avec le tableur. Aujourd'hui, un écart se découvre
> quand quelqu'un pense à comparer deux totaux — souvent en fin de journée,
> parfois le lendemain. Ici, il ne peut pas passer inaperçu. »

**Rétablissez** la quantité correcte ; le bandeau redevient vert.

### 1.4 Le document signé — 2:45 à 3:25

**À l'écran** : cliquez *Imprimer / PDF*. Laissez l'aperçu s'afficher en grand.

> « Le document imprimé ne change pas de nature. Une seule page, au format
> paysage : le comptage détaillé, les mouvements du jour, l'écart, le montant en
> lettres, et les emplacements de signature du caissier et du chef d'agence.
>
> Il se signe et s'archive exactement comme aujourd'hui. »

**Zoomez** sur le bas de page, sur les deux lignes de signature.

> « C'est un point qui compte : la validation reste humaine, et la trace papier
> reste la même. »

Fermez l'aperçu.

### 1.5 L'historique — 3:25 à 4:05

**À l'écran** : onglet *Historique*.

> « Chaque situation clôturée est conservée. On retrouve une journée par sa date
> et sa devise, sans chercher dans une arborescence de fichiers. »

**Pointez** la ligne du 22 juillet, affichée en rouge.

> « Et les écarts ressortent. Cette journée-là présentait un déficit de cinquante
> mille francs. Il est enregistré avec la situation, la caissière concernée et
> l'observation portée au moment de la clôture.
>
> C'est ce qui permet, en fin de mois, de voir si les écarts se concentrent sur
> une caisse, sur un jour de la semaine, ou s'ils sont isolés. »

**Montrez** le bouton *Exporter CSV*.

> « L'ensemble s'exporte pour être repris en tableur par le contrôle interne. »

---

## CHAPITRE 2 — Une journée de caisse

*Public : caissières, chefs d'agence. Durée ≈ 2 min 40.*

> « Cette partie suit une journée complète, du matin à la clôture. »

### 2.1 Le matin — 4:05 à 4:45

**À l'écran** : onglet *Saisie du jour*, date du jour, devise GNF, statut
*Brouillon*.

> « À l'ouverture, la caissière choisit la date et la devise. Le statut indique
> Brouillon : rien n'est figé, elle peut revenir sur sa saisie autant de fois
> qu'elle veut. »

**Pointez** le champ *Solde précédent*, déjà rempli.

> « Le solde précédent est repris automatiquement de la dernière journée
> clôturée. C'est une ressaisie en moins, et surtout une source d'erreur en
> moins : le report ne peut pas être faux. »

### 2.2 Le comptage — 4:45 à 5:20

**À l'écran** : saisissez plusieurs quantités à la suite, sans commenter chaque
ligne.

> « Le comptage se fait coupure par coupure, de la plus grosse à la plus petite,
> dans l'ordre où les billets sont classés. La caissière ne tape que des
> quantités : jamais un montant, jamais un total. »

**Pointez** le total.

> « Les multiplications et la somme ne sont plus à sa charge. »

### 2.3 Les mouvements et la clôture — 5:20 à 6:05

**À l'écran** : la colonne de droite, *Mouvements & solde comptable*. Remplissez
*Entrée* puis *Sortie*.

> « À droite, les mouvements de la journée : les entrées, les sorties, les
> versements et paiements après caisse. Le solde comptable se recalcule à chaque
> saisie, et se compare en permanence au comptage physique. »

**Renseignez** *Le Caissier* et *Chef d'Agence*, puis cliquez **Clôturer la
situation**.

> « À la clôture, l'application demande le nom du caissier — une situation
> anonyme n'aurait pas de sens. »

**Si un écart subsiste**, la fenêtre de confirmation apparaît. Montrez-la.

> « Et si un écart subsiste, elle ne bloque pas : elle demande une confirmation
> explicite. Un écart existe, il arrive, il doit être assumé et conservé — pas
> masqué. »

**Confirmez.** Le statut passe à *Clôturée* et les champs se verrouillent.

> « La situation est alors clôturée et les champs sont verrouillés. »

### 2.4 Les autres devises — 6:05 à 6:25

**À l'écran** : cliquez *EUR*, puis *USD*.

> « La même journée s'établit séparément pour l'euro et le dollar. Chaque devise
> a ses propres coupures et son propre solde : ce sont trois caisses distinctes,
> dans une seule application. »

### 2.5 Le paramétrage — 6:25 à 6:45

**À l'écran** : onglet *Paramètres*.

> « L'agence règle une fois pour toutes son intitulé, son nom, et les noms par
> défaut. La liste des coupures est modifiable : si la Banque Centrale émet une
> nouvelle valeur, ou en retire une, cela se corrige ici, sans intervention
> technique. »

---

## CHAPITRE 3 — Déploiement et exploitation

*Public : service informatique, contrôle interne. Durée ≈ 1 min 50.*

### 3.1 L'installation sur les postes — 6:45 à 7:20

**À l'écran** : le Bureau, avec l'icône *Situation de Caisse*.

> « Trois modes d'installation coexistent.
>
> Un installeur Windows, déployable par stratégie de groupe, qui pose une icône
> sur le Bureau et dans le menu Démarrer de chaque poste.
>
> Une installation par le navigateur, que la caissière fait elle-même, sans
> droits administrateur.
>
> Et la solution recommandée pour la banque : la publication sur un serveur
> interne. L'application est alors servie par le réseau de la banque, aucune
> donnée ne sort, et une mise à jour unique s'applique à toutes les agences. »

### 3.2 Hors ligne et sauvegarde — 7:20 à 7:55

**Coupez le réseau avant cette séquence.** Rechargez l'application : elle
s'ouvre normalement.

> « L'application fonctionne sans réseau. Une agence dont la liaison est coupée
> continue d'établir et d'imprimer ses situations. »

**À l'écran** : *Paramètres → Sauvegarde des données*.

> « Les données sont conservées sur le poste. Elles s'exportent en un fichier,
> et se réimportent sur un autre poste — c'est ce qui permet de remonter une
> caisse après un changement de matériel, ou de centraliser les situations d'une
> agence. »

### 3.3 Ce que l'outil ne fait pas — 7:55 à 8:35

**À l'écran** : revenez au tableau de saisie, immobile.

> « Un mot sur les limites, parce qu'elles doivent être connues avant toute
> généralisation.
>
> L'application n'a pas d'authentification : elle ne sait pas qui est devant le
> poste. Le nom du caissier est un champ, pas une identité vérifiée. Les données
> ne sont pas chiffrées sur le poste, et une personne technique pourrait modifier
> l'historique sans laisser de trace.
>
> Ces protections sont prévues : un code personnel par caissière, le verrouillage
> définitif des situations clôturées, une sauvegarde centralisée et un journal
> d'audit. Elles feront l'objet d'une seconde étape, à valider avec le
> responsable sécurité.
>
> En l'état, l'outil est sûr comme outil de travail. Il ne remplace pas encore un
> système de confiance — mais il remplace un fichier Excel, qui n'offrait aucune
> de ces protections. »

---

### Clôture — 8:35 à 9:05

**À l'écran** : retour à l'onglet *À propos*.

> « L'application est prête à être essayée en conditions réelles.
>
> Ce que je propose : un pilote sur une agence, pendant un mois, en parallèle du
> fichier Excel actuel. Les caissières comparent, signalent ce qui manque, et la
> décision de généraliser se prend sur des faits plutôt que sur une
> démonstration.
>
> Merci de votre attention. »

**Dernier plan** : la page *À propos*, avec la mention du Département
Informatique. Trois secondes, immobile.

---

## Partie III — Après le tournage

### Remettre le poste en état

Réimportez la sauvegarde faite à l'étape 1 de la préparation
(*Paramètres → Importer une sauvegarde*). Sans cela, le poste reste sur le jeu
de démonstration.

### Montage

- **Marquez les chapitres** dans la description, avec leurs horodatages.
- **Coupez les temps morts** : la frappe des quantités est répétitive, accélérez
  ou coupez au montage.
- **Zoomez sur les chiffres.** Le montant en lettres et le bandeau d'écart sont
  les deux plans qui doivent être lisibles après compression : agrandissez-les
  à 150 %.
- **Laissez le bandeau rouge à l'écran deux secondes de plus** que ce qui semble
  nécessaire. C'est le plan que le public doit retenir.
- **Pas de musique sous la voix.**

### Vérification avant diffusion

Regardez le montage final en cherchant **uniquement** ces cinq choses :

1. Un montant de caisse réel apparaît-il quelque part ?
2. Le nom d'une caissière en poste est-il lisible ?
3. La barre d'adresse est-elle visible sur un seul plan ?
4. Une adresse électronique personnelle apparaît-elle ?
5. Les outils de développement se sont-ils ouverts par accident ?

**Faites cette relecture après une nuit**, pas juste après le montage : on ne
voit plus ce qu'on vient de regarder vingt fois.

### Où la diffuser

| Public | Support |
|---|---|
| Direction de la banque | Fichier remis en main propre, pas de plateforme publique |
| Formation des caissières | Chapitre 2 seul, découpé en séquences courtes |
| Portfolio professionnel | Chapitres 1 et 3, données de démonstration uniquement |

> **Ne publiez pas le montage intégral sur une plateforme publique** sans
> l'accord écrit de la banque. Même sur des données fictives, la vidéo montre
> l'organisation d'une caisse d'agence et le circuit de validation : ce sont des
> informations qui ne vous appartiennent pas.
