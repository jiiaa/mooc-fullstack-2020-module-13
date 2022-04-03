CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES (
  'Nokes Greg', 'https://blog.heroku.com/faster-postgres-backups','Announcing Heroku Postgres Enhancements: 40x Faster Backups',0
),(
  'Nokes Greg','https://blog.heroku.com/connection-pooling','Connection Pooling for Heroku Postgres Is Now Generally Available',493
),(
  'Bernius Kelsey','https://github.blog/2022-03-29-career-tips-for-beginner-developers/','Career tips for beginner developers',2049
),(
  'Woodward Martin','https://github.blog/022-03-29-github-copilot-now-available-for-visual-studio-2022/','GitHub Copilot now available for Visual Studio 2022',83
);
