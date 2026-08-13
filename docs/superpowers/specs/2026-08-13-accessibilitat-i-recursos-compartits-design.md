# Accessibilitat i recursos compartits — Disseny

## Objectiu

Millorar l'estructura accessible i la mantenibilitat de les 83 pàgines del mòdul 0227 sense alterar el contingut docent, l'aspecte visual ni el funcionament de les activitats.

## Abast aprovat

1. Envoltar el contingut principal de cada pàgina amb un element HTML `<main>`.
   La navegació superior, la capçalera de la pàgina, els blocs didàctics i el paginador continuaran sent visualment idèntics.
2. Extreure el CSS comú «Sinapsi» i el JavaScript comú dels qüestionaris a fitxers compartits, carregats amb rutes relatives correctes des de la portada i des de les tres subcarpetes (`teoria`, `activitats` i `guies`).

## Restriccions

- Català com a idioma de tota interfície i missatgeria existent.
- Sense dependències noves ni procés de compilació.
- No modificar textos, ordres, respostes, enllaços, títols ni numeració didàctica.
- Preservar la compatibilitat amb GitHub Pages i la impressió.
- Preservar la compatibilitat visual a escriptori i mòbil (375 px).
- El qüestionari ha de mantenir la selecció, la correcció, el reinici i els missatges accessibles existents.

## Arquitectura

S'afegiran dos recursos estàtics sota `_identitat/`: `sinapsi.css` contindrà tots els estils comuns i `quiz.js` contindrà el comportament actual dels qüestionaris. Cada document HTML conservarà només la seva estructura i contingut, referenciarà aquests recursos i embolcallarà la zona de contingut dins de `<main>`.

Les rutes seran explícites per profunditat: la portada usarà `_identitat/...`; les pàgines d'RA usaran `../_identitat/...`; i les pàgines de `teoria`, `activitats` i `guies` usaran `../../_identitat/...`.

## Verificació

- Una comprovació automatitzada verificarà les 83 pàgines: un únic `<main>`, una única referència al CSS compartit, la ruta relativa corresponent, i absència dels blocs CSS i JS extrets.
- Una comprovació de referències locals garantirà que no s'introdueixen enllaços trencats.
- Es provarà un qüestionari real: seleccionar una resposta correcta, comprovar-la i verificar el missatge «Correcte!» i l'estat visual.
- Es revisarà visualment una pàgina de teoria en escriptori i a 375 px, i la portada a 375 px.

## Fora d'abast

- Conversió dels qüestionaris a banc de preguntes Moodle, QTI o GIFT.
- Canvis curriculars o verificació exhaustiva de totes les instruccions tècniques d'Ubuntu.
- Redisseny visual, canvis de tipografia o de paleta.
