const feeder = require('./feeder');
const database = require('./database');
const scrapeNewPapers = require('./scraper_papers');
const scrapeNewIssues = require('./scraper_issues');

const run = async () => {
  try {
    const [newArticles, newPapers] = await Promise.all([
      scrapeNewIssues(),
      // scrapeNewPapers(),
    ]);

    console.log(
      'scrape resulted in %d new articles', // and %d new papers",
      newArticles.length,
      // newPapers.length
    );

    const newItems = newArticles; // .concat(newPapers);
    await feeder.recreate();

    if (newItems.length) {
      await database.addItems(newItems);
      await feeder.recreate();
    }
  } catch (err) {
    console.error(err);
  }
};

run();
