# Dev Scout

I wanted to build something that could find the developers who contributed the most to certain topics for a given repo. The demo is just for next.js, but this could be applied anywhere. 

For example, if you were using Next.js and were having issues or a bug with server actions, you could use this to find the right devs to reach out to. Didn't spend too much time on UI/UX but the core integration with [Greptile](https://greptile.com) is there.

## How to use

1. Clone the Repo
2. add a `.env.local` file with the following:
```
GREPTILE_API_KEY=<YOUR_GREPTILE_KEY>
GITHUB_TOKEN=<YOUR_GITHUB_TOKEN>
```
3. Run `pnpm i` to install dependencies
4. Run `pnpm dev` to run the app
5. View the app on localhost

