/* translate.js | converts common Bible formats to JSON. */
var config = require('./config.js'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    fs     = require('fs'),
    lr     = require('line-reader'),
    _      = require('underscore');

fs.readdir(scribe.translate, function enterLibrary(e, shelves) {
  console.log('----------');

  shelves.forEach(function viewShelves(literature) {
    var literaturePath = scribe.translate + literature + '/';
    var infoPath       = literaturePath + 'info.json';

    if (fs.existsSync(infoPath)) {
      var info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

      var Version     = info.abbreviation;
      var version     = Version.toLowerCase();
      var versionPath = scribe.library + version + '/';
      console.log('Processing ' + info.name + ' ' + literaturePath);

      if (fs.existsSync(versionPath) && !scribe.process.overwrite) {
        console.log(Version + ' already exists: ' + versionPath);
        console.log('--');
      } else {
        /* Make a folder for each version. */
        if (!fs.existsSync(versionPath)) {fs.mkdirSync(versionPath); }

        translate = {
          osis: function () {
            var bible = {};
            var write;
            fs.readFile(literaturePath + info.file + '.xml', function (e, data) {
              parser.parseString(data, function (e, result) {
                var theBible = result.osis.osisText[0].div;
                _.each(theBible, function readBooks(b, book) {
                  var books    = theBible[book].$.osisID;
                  var theBooks = theBible[book].chapter;
                  switch (books) {
                  case 'Gen':books = 'Genesis';break;case 'Exod':books = 'Exodus';break;case 'Lev':books = 'Leviticus';break;case 'Num':books = 'Numbers';break;case 'Deut':books = 'Deuteronomy';break;case 'Josh':books = 'Joshua';break;case 'Judg':books = 'Judges';break;break;case '1Sam':books = '1 Samuel';break;case '2Sam':books = '2 Samuel';break;case '1Kgs':books = '1 Kings';break;case '2Kgs':books = '2 Kings';break;case '1Chr':books = '1 Chronicles';break;case '2Chr':books = '2 Chronicles';break;case 'Neh':books = 'Nehemiah';break;case 'Esth':books = 'Esther';break;case 'Ps':books = 'Psalms';break;case 'Prov':books = 'Proverbs';break;case 'Eccl':books = 'Ecclesiastes';break;case 'Song':books = 'Song of Solomon';break;case 'Isa':books = 'Isaiah';break;case 'Jer':books = 'Jeremiah';break;case 'Lam':books = 'Lamentations';break;case 'Ezek':books = 'Ezekiel';break;case 'Dan':books = 'Daniel';break;case 'Hos':books = 'Hosea';break;case 'Obad':books = 'Obadiah';break;case 'Mic':books = 'Micah';break;case 'Nah':books = 'Nahum';break;case 'Hab':books = 'Habakkuk';break;case 'Zeph':books = 'Zephaniah';break;case 'Hag':books = 'Haggai';break;case 'Mal':books = 'Malachi';break;case 'Matt':books = 'Matthew';break;case 'Rom':books = 'Romans';break;case '1Cor':books = '1 Corinthians';break;case '2Cor':books = '2 Corinthians';break;case 'Gal':books = 'Galatians';break;case 'Eph':books = 'Ephesians';break;case 'Phil':books = 'Philippians';break;case 'Col':books = 'Colossians';break;case '1Thess':books = '1 Thessalonians';break;case '2Thess':books = '2 Thessalonians';break;case '1Tim':books = '1 Timothy';break;case '2Tim':books = '2 Timothy';break;case 'Phlm':books = 'Philemon';break;case 'Heb':books = 'Hebrews';break;case 'Jas':books = 'James';break;case '1Pet':books = '1 Peter';break;case '2Pet':books = '2 Peter';break;case '1John':books = '1 John';break;case '2John':books = '2 John';break;case '3John':books = '3 John';break;case 'Rev':books = 'Revelation';break;
                  }
                  _.each(theBooks, function readChapters(c, chapter) {
                    var cName       = theBooks[chapter].$.osisID;
                    var chapters    = cName.split('.')[1];
                    var theChapters = theBooks[chapter].verse;
                    _.each(theChapters, function readVerses(v, verse) {
                      var vName  = theChapters[verse].$.osisID;
                      var verses = vName.split('.')[2];
                      var text   = theChapters[verse]._;
                      if (!bible[books])                   { bible[books] = {}; }
                      if (!bible[books][chapters])         { bible[books][chapters] = {}; }
                      if (!bible[books][chapters][verses]) { bible[books][chapters][verses] = {}; }
                      bible[books][chapters][verses] = text;
                    });
                  });
                });
              });
              write = JSON.stringify(bible);
              fs.writeFileSync(versionPath + version + '.json', write, 'utf8');
            });
          },

          // scrollmapper: function () {
          // },

          usfm: function () {
          },

          /* unbound | github.com/acoll | Adam Coll */
          unbound: function () {
            var bible      = {};
            var books      = {};
            var bookSearch = {};
            function readBooks(line, last) {
              var l     = line.replace('\r', '');
              var split = l.split('\t');
              bookSearch[split[0]] = split[1];
            }
            function readBible(line, last) {
              if (line.indexOf('#') !== 0) {
                var l     = line.replace('\r', '');
                var split = l.split('\t');
                var o     = {
                  book:     bookSearch[split[0]],
                  chapter:  split[1],
                  verse:    split[2],
                  subverse: split[3],
                  orderBy:  split[4],
                  text:     split[5]
                };
                txtSwitch = false;
                if ([o.text] == '')                    { o.text = split[4];txtSwitch = true; }
                if (txtSwitch && [o.text] == '')       { o.text = split[3]; }
                if (!books[o.book])                     { books[o.book] = {}; }
                if (!books[o.book][o.chapter])          { books[o.book][o.chapter] = {}; }
                if (!books[o.book][o.chapter][o.verse]) { books[o.book][o.chapter][o.verse] = {}; }
                books[o.book][o.chapter][o.verse] = o.text;
              }
            }
            lr.eachLine(literaturePath + 'book_names.txt', readBooks)
              .then(function () {
              lr.eachLine(literaturePath + info.file + '_utf8.txt', readBible)
                .then(function () {
                bible.books = books;
                write       = JSON.stringify(bible.books);
                fs.writeFileSync(versionPath + version + '.json', write, 'utf8');
              });
            });
          }
        };

        var infoFile                     = '{\r\n';
        if (info.type)         { infoFile += '"type": "' + info.type + '",\r\n'; }
        if (info.abbreviation) { infoFile += '"file": "' + version + '.json",\r\n'; }
        if (info.name)         { infoFile += '"name": "' + info.name + '",\r\n'; }
        if (info.abbreviation) { infoFile += '"abbreviation": "' + info.abbreviation + '",\r\n'; }
        if (info.language)     { infoFile += '"language": "' + info.language + '",\r\n'; }
        infoFile                          += '"format": "json"\r\n';
        infoFile                          += '}';
        fs.writeFileSync(versionPath + 'info.json', infoFile, 'utf8');
        translate[info.format]();
        console.log('--');
      } // End versionPath does not exist

    } // End infoPath exists
  }); // End viewShelves
  console.log('Complete');
  console.log('----------');
}); // End enterLibrary