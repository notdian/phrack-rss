const { Feed } = require('feed');
const { PHRACK_URL, PHRACK_LOGO_URL, FEED_RSS_FILE } = require('./config');
const { convertToDate } = require('./helpers');
const { writeFile } = require('./filesystem');
const database = require('./database');

exports.recreate = async () => {
  const items = database.getNewestItems();

  const info = {
    title: '.:: Phrack Magazine ::.',
    description: 'Phrack unofficail RSS feed of Issues and Papers',
    id: PHRACK_URL,
    link: PHRACK_URL,
    image: PHRACK_LOGO_URL,
  };

  const feed = new Feed(info);

  items.forEach((item) => {
    feed.addItem({
      title: item.title,
      id: item.link,
      link: item.link,
      author: [{
        name: item.authorName,
        link: item.authorLink,
      }],
      date: convertToDate(item.date),
    });
  });

  await Promise.all([writeFile(FEED_RSS_FILE, feed.rss2())]);
};
