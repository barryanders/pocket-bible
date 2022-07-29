# Pocket Bible
A simple offline Bible reader. There are 7 versions included, and you can add more.

![bible](https://cloud.githubusercontent.com/assets/5648875/6840545/2ae66460-d348-11e4-891f-11b7b2a0a27c.png)

## Getting Started

To get started using Pocket Bible, go to `/content/index.html` in your browser. The following versions ship with Pocket Bible.

- American Standard Version (ASV)
- Arabic Smith & Van Dyke (SVD)
- French Ostvervald (FO)
- German Schlachter (GS)
- King James Version (KJV)
- New Chinese Version Simplified (NCVS)
- World English Bible (WEB)

Feel free to download this and use it however you like. For example, you could put it on a flash drive and take it with you to use on any computer.

### Features

- Responsive Design
- Version and Book Drop-down Menus
- Hash-based Routing
- Infinite Scrolling

## Generate More Bible Versions

Using the included command line tools, you can generate more Bible versions.

### Supported Formats

&#x2713; [OSIS](https://github.com/gratis-bible/bible)<br>
&#x2713; [Unbound](https://www.biola.edu/talbot/unbound)<br>

### Step I: Setup

1. Install Node.js (http://nodejs.org/download/) for your platform.
2. Navigate to the `/core/tools/scribe` folder.
3. Run `npm install` to install dependencies.
4. For each Bible that you want to convert, create a file named `info.json`. Use this template as a guide.
```
{
  "type": "Bible",
  "file": "asv",
  "name": "American Standard Version",
  "abbreviation": "ASV",
  "language": "English",
  "format": "unbound"
}
```

### Step II: Generate HTML from OSIS and/or Unbound Bibles

1. Add OSIS and/or Unbound Bibles to the `/core/tools/scribe/literature` folder.
2. Run `node /core/tools/scribe/translate.js` to convert all Bibles in the `/core/tools/scribe/literature` folder to JSON.
3. Run `node /core/tools/scribe/write.js` to convert all JSON Bibles in the `/core/api/literature` folder to HTML.

## Versioning

Release format: `<major>.<minor>.<patch>`

## Author

<table>
  <thead>
    <tr>
      <th valign="middle" align="center">
        <a href="https://barryanders.github.io"><img alt="Barry Anders" src="https://avatars.githubusercontent.com/u/91902180?v=4&s=200" width="100" height="100"></a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="middle" align="center">
        <a href="https://barryanders.github.io"><strong>Barry Anders</strong></a>
      </td>
    </tr>
  </tbody>
</table>

