<p align="center">
  <img src="https://zoe-bot-docs.vercel.app/zoe.png">
</p>
<p align="center">
  <i>Artwork by <a href="https://twitter.com/q_hush">Quiet Hush</a></i>
</p>

<h1 align="center">Welcome to the Zoe Bot 4 repo 👋</h1>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/prazdevs/zoe-bot-4" />
  <img src="https://img.shields.io/github/license/prazdevs/zoe-bot-4" />
  <img src="https://img.shields.io/github/workflow/status/prazdevs/zoe-bot-4/Build?logo=GitHub&label=build" />
  <img src="https://img.shields.io/codeclimate/maintainability/prazdevs/zoe-bot-4?logo=code-climate" />
  <img src="https://img.shields.io/npm/types/typescript" />
</p>

<p align="center">
  <a href="https://zoe-bot-docs.vercel.app" alt="Zoe Bot 4 docs" >
    <img src="https://img.shields.io/badge/ZoeBot4-read%20the%20docs-green?style=for-the-badge&logo=Read%20the%20Docs&logoColor=white" />
  </a>
</p>

## 🧱 Prerequisites

To run your instance of the bot, you will need:

- a Discord app & bot token. Get it [here](https://discord.com/developers/applications).
- a Reddit app with client id and secret. Get it [here](https://discord.com/developers/applications).
- a Postgres database and its connection URL.

## 🚀 Easy deployment on Heroku

Click on the button:

<a href="https://heroku.com/deploy?template=https://github.com/prazdevs/zoe-bot-4" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="deploy to heroku" />
</a>

Note: it will provision a free tier worker dyno and a free tier postgres add-on.

## 🔨 Manual installation

Follow the steps:

1. Install dependencies: `yarn`.
2. Build the solution: `yarn build`.
3. Set up the following environment variables:
   - `DISCORD_TOKEN`: your Discord bot token.
   - `DATABASE_URL`: your Postgres database connection URL.
   - `REDDIT_USERNAME`: the reddit username associated with the app.
   - `REDDIT_PASSWORD`: the reddit password associated with the app.
   - `REDDIT_APP_ID`: the reddit client id associated with the app.
   - `REDDIT_APP_SECRET`: the reddit client secret associated with the app.;
4. Run the application: `yarn start`.

## 🤝 Contributing

Any contribution to the project is welome.  
Run into a problem? Open an [issue](https://github.com/prazdevs/zoe-bot-4/issues/new/choose).  
Want to add some feature? PRs are welcome!

## 👤 About the author

Feel free to contact me:

- <a href="https://twitter.com/prazdevs" target="_blank"><img src="https://img.shields.io/twitter/follow/prazdevs?style=social" /><a/>
- <img src="https://img.shields.io/badge/Discord-PraZ%234184-darkgrey?labelColor=7289DA&logo=discord&logoColor=white" />

## 📝 Licence

Copyright © 2020 [Sacha Bouillez](https://github.com/prazdevs).<br />
This project is under [MIT](https://github.com/prazdevs/zoe-bot-4/blob/master/LICENCE) license.
