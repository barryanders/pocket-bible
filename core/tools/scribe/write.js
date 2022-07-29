/* write.js | Converts JSON Bibles to html. */
var fs = require('fs'),
    _  = require('underscore');

require('./config.js');

var canon          = JSON.parse(fs.readFileSync(scribe.api + 'canon.json', 'utf8'));
var protocanonical = canon.OT + canon.NT;

/* Make the build folders. */
if (!fs.existsSync(scribe.build)) { fs.mkdirSync(scribe.build); }
if (!fs.existsSync(scribe.build + 'bibles/')) { fs.mkdirSync(scribe.build + 'bibles/'); }

fs.readdir(scribe.library, function enterLibrary(e, shelves) {
  console.log('----------');
  console.time('Total Time');
  var shelfPath  = scribe.build + 'assets/js/';
  var writeShelf = '';

  shelves.forEach(function viewShelves(literature) {
    var literaturePath = scribe.library + literature + '/';
    var infoPath       = literaturePath + 'info.json';
    if (fs.existsSync(infoPath)) {
      var info         = JSON.parse(fs.readFileSync(infoPath, 'utf8'));

      switch (info.type) {
      case 'Bible':
        var Version       = info.abbreviation;
        var version       = Version.toLowerCase();
        var versionPath   = scribe.build + 'bibles/' + version + '/';
        var writeVersion  = '<h1>' + info.name + ' (' + Version + ')</h1>';
        var writeBookMenu = '';
        console.log('Processing ' + info.name + ' ' + literaturePath);

        if (fs.existsSync(versionPath) && !scribe.process.overwrite) {
          console.log(Version + ' already exists: ' + scribe.build + version + '/');
          console.log('--');
        } else {
          /* Make a folder for each version. */
          if (!fs.existsSync(versionPath)) { fs.mkdirSync(versionPath); }
          console.time(Version + ' converted to HTML');

          write = {
            scripture: function() {
              var Bible  = JSON.parse(fs.readFileSync(literaturePath + info.file, 'utf8'));
              var Bibles = _.keys(Bible).sort(function(a, b) {return protocanonical.indexOf(a) - protocanonical.indexOf(b);});
              OTfirst = true;
              NTfirst = true;
              Bibles.forEach(function readBibles(Book) {
                var OT    = canon.OT.indexOf(Book);
                var NT    = canon.NT.indexOf(Book);
                var books = Bible[Book];
                /* standardize alternate book names */
                switch (Book) {
                case 'Jehoshua':
                  Book = 'Joshua';
                  break;
                case 'Song of Solomon':
                  Book = 'Song of Songs';
                  break;
                case 'Acts of the Apostles':
                  Book = 'Acts';
                  break;
                };
                var book       = Book.replace(/\s+/g, '').toLowerCase();
                var bookPath   = versionPath + book + '/';
                var writeBooks = '';
                /* Make a folder for each book. */
                if (!fs.existsSync(bookPath)) { fs.mkdirSync(bookPath); }
                /* Old Testament */
                if (OT > -1) {
                  if (OTfirst) { writeVersion  += '<h3>Old Testament</h3>';OTfirst = false; }
                  writeVersion  += '<a alt="' + Book + '" href="' + scribe.route + '/' + version + '/' + book + '/1">' + Book + '</a><br>';
                  writeBookMenu += '<option value="' + scribe.route + '/' + version + '/' + book + '/1">' + Book + '</option>';
                }
                /* New Testament */
                if (NT > -1) {
                  if (NTfirst) { writeVersion  += '<br><h3>New Testament</h3>';NTfirst = false; }
                  writeVersion  += '<a alt="' + Book + '" href="' + scribe.route + '/' + version + '/' + book + '/1">' + Book + '</a><br>';
                  writeBookMenu += '<option value="' + scribe.route + '/' + version + '/' + book + '/1">' + Book + '</option>';
                }
                _.each(books, function readBooks(c, chapter) {
                  var chapters      = books[chapter];
                  var chapterPath   = bookPath + chapter;
                  var writeChapters = '<div><h4>' + Book + ' ' + chapter + '</h4>';
                      writeBooks   += '<a alt="' + book + ' ' + chapter + '" href="' + scribe.route + '/' + version + '/' + book + '/' + chapter + '"><div class="chapter-btn">' + chapter + '</div></a>';

                  _.each(chapters, function readChapters(verse, reference) {
                    writeChapters += '<span class="' + reference + '"> ' + reference.sup() + ' ' + verse + '</span>';
                  });
                  /* Make a file for each chapter. */
                  writeChapters += '</div>';
                  fs.writeFileSync(chapterPath + '.html', writeChapters, 'utf8');
                });
                /* Make a file for each book. */
                fs.writeFileSync(bookPath + 'index.html', writeBooks, 'utf8');
              });
              /* Make a file for each version. */
              fs.writeFileSync(versionPath + 'index.html', writeVersion, 'utf8');
              fs.writeFileSync(versionPath + 'menu.html', writeBookMenu, 'utf8');
            }
          };
          write.scripture();
          console.timeEnd(Version + ' converted to HTML');
          console.log('--');
        }; // End versionPath does not exist
        writeShelf += '"' + literature + '",\r\n';
        break; // End case Bible

      default:
        break; // End default
      } // End switch info.type
      /* Make a file with a list of literature. */
    } // End infoPath exists
  }); // End viewShelves
  fs.writeFileSync(shelfPath + 'shelf.json', '{\r\n"bibles": [\r\n' + writeShelf.substring(0, writeShelf.lastIndexOf(',')) + '],\r\n"primary": "/' + scribe.primary + '/genesis/1"\r\n}', 'utf8');
  console.timeEnd('Total Time');
  console.log('----------');
}); // End enterLibrary