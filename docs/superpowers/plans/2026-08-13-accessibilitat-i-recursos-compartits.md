# Accessibilitat i recursos compartits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Centralitzar els recursos comuns i afegir un landmark principal a totes les pàgines sense alterar el resultat visible ni la interactivitat.

**Architecture:** Els estils i el comportament del qüestionari es mouran a `_identitat/sinapsi.css` i `_identitat/quiz.js`. Un script de verificació sense dependències comprovarà l'estructura de totes les pàgines, les rutes relatives i l'absència dels blocs duplicats.

**Tech Stack:** HTML5, CSS, JavaScript del navegador, Node.js estàndard.

## Global Constraints

- No modificar contingut docent, missatges, respostes, enllaços ni jerarquia de títols.
- Conservar el català, la impressió, GitHub Pages i la visualització a 375 px.
- No incorporar dependències ni procés de compilació.
- Les rutes han de ser `_identitat/...` a la portada, `../_identitat/...` als índexs RA i `../../_identitat/...` a les pàgines internes.

---

### Task 1: Prova estructural de la migració

**Files:**
- Create: `tests/verify-shared-resources.mjs`
- Test: `tests/verify-shared-resources.mjs`

**Interfaces:**
- Consumes: Documents `.html` sota l'arrel del repositori.
- Produces: Sortida `PASS: 83 HTML pages verified` o llista d'errors amb el fitxer afectat.

- [ ] **Step 1: Write the failing test**

Crear un script Node que recorri els documents HTML i exigeixi exactament un `<main>`, una referència CSS i una referència JS als recursos compartits amb la ruta relativa esperada. També ha de rebutjar `<style>` i scripts inline.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-shared-resources.mjs`

Expected: FAIL, perquè les pàgines encara contenen `<style>`, scripts inline i no tenen `<main>`.

- [ ] **Step 3: Write minimal implementation**

El script només farà servir `node:fs`, `node:path` i expressions regulars; no dependrà de paquets externs.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-shared-resources.mjs`

Expected: `PASS: 83 HTML pages verified`.

### Task 2: Recursos comuns i migració mecànica

**Files:**
- Create: `_identitat/sinapsi.css`
- Create: `_identitat/quiz.js`
- Modify: `index.html`
- Modify: `RA1/index.html` … `RA8/index.html`
- Modify: `RA*/teoria/*.html`, `RA*/activitats/*.html`, `RA*/guies/*.html`

**Interfaces:**
- Consumes: Els blocs comuns delimitats per `SINAPSI-CSS INICI/FI` i el script de qüestionari de cada pàgina.
- Produces: Documents HTML que carreguen `sinapsi.css`, i `quiz.js` quan tenen qüestionari, amb el contingut dins de `<main>`.

- [ ] **Step 1: Run the failing structural test**

Run: `node tests/verify-shared-resources.mjs`

Expected: FAIL amb errors d'estil inline, de landmark absent i de referència compartida absent.

- [ ] **Step 2: Extract the shared resources**

Copiar el CSS idèntic del bloc Sinapsi a `_identitat/sinapsi.css`; copiar el codi de qüestionari idèntic a `_identitat/quiz.js`. Mantindre els comentaris d'autoria existents.

- [ ] **Step 3: Transform each HTML document**

Substituir el bloc `<style>…</style>` per un `<link rel="stylesheet">` amb la ruta de la seva profunditat. Substituir el script inline per un `<script src>` amb la ruta corresponent. Obrir `<main>` abans de `<header class="cq-header">` i tancar-lo després del paginador.

- [ ] **Step 4: Run the structural test**

Run: `node tests/verify-shared-resources.mjs`

Expected: `PASS: 83 HTML pages verified`.

### Task 3: Validació funcional i visual

**Files:**
- Test: `tests/verify-shared-resources.mjs`
- Test: Totes les pàgines HTML generades.

**Interfaces:**
- Consumes: El lloc estàtic migrat.
- Produces: Evidència de navegació local correcta, qüestionari funcional i validació visual en escriptori i a 375 px.

- [ ] **Step 1: Verify local links**

Run una comprovació de tots els `href` locals a les 83 pàgines.

- [ ] **Step 2: Verify the questionnaire**

Obrir `RA1/teoria/t1-1-dhcp-fonaments.html`, triar la primera resposta correcta, prémer «Comprova» i confirmar que apareix «Correcte!».

- [ ] **Step 3: Verify visual preservation**

Capturar la portada i la pàgina de DHCP a escriptori i a 375 px; comprovar que no hi ha scroll horitzontal ni errors de consola.

- [ ] **Step 4: Run the design detector**

Run: `node /home/adr1/.agents/skills/impeccable/scripts/detect.mjs --json index.html RA1/teoria/t1-1-dhcp-fonaments.html RA6/guies/g6-1-openssh.html`

Expected: Cap regressió nova; només el fals positiu existent de la nota de versió.
