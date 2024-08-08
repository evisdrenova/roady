# Roady

Roady is a completely open source public roadmap that allows users to submit enhancements and feature requests and upvote existing ones.

Roady uses Linear as a back-end and directly syncs with a linear project.

Roady is built using:

- nextJS
- typescript
- zod
- tailwind
- shadcn
- react-hook-form
- nextauth

## Features

1. Users can submit tasks that automatically get created in Linear
2. Users can upvote tasks which automatically gets recorded in Linear
3. Google OAuth authentication for task submission and upvoting to ensure that only real users can submit new tasks and upvote existing tasks.
4. Users can include inline code snippets and code blocks in their task submissions
5. Users can attack images to their task submissions
6. Roadmap style view with different stages that are automatically tracked through Linear

## Getting Started

Here is how to get run roady locally.

1. First clone down the roady repo using `git clone`.

2. Once you have your credentials and linear api keys, set them as environment variables in a `.env.` file for local development. For a production development, set them wherever you set your environment variables. For example:

- **Linear API Key** -> this is used to talk to your Linear instance. To create a new Linear api key, follow [these instructions](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#authentication) and create a Personal API Key.
- **Google OAuth credentials** - if you're running Roady in auth mode, you'll need Google OAuth credentials. Follow [this guide](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) to create Google OAuth credentials and an application. Make sure that you set the right scopes. Set these as environment variables so that roady can read them in.
- **Linear Project Name** - Roady pulls issues from a given linear project. Include the name of the project that you want to render your public tickets and set it as an environment variable named `PROJECT_NAME`. For example, `PROJECT_NAME=Public Roadmap`
- **Auth secret** - you can create an auth secret by running `openssl rand -base64 33` in your terminal and copying and pasting the resulting string into an environment variables called `AUTH_SECRET`.

For example:

```bash
LINEAR_API_KEY=XXXX
PROJECT_NAME="Public Roadmap"
GOOGLE_ID=XXXXX
GOOGLE_SECRET=XXXXX
AUTH_SECRET="XXXX" # Added by `npx auth`. Read more: https://cli.authjs.dev
```

## Auth mode

Roady can be run in either auth mode or non-auth mode. We recommend running Roady in auth mode as a way to ensure that only valid users submit/upvotes tasks. In order for auth mode to work, you'll need to create a Google OAuth application and pass in the `GOOGLE_ID` and `GOOGLE_SECRET` as environment variables.

### Running Roady in un-Auth mode

By default, auth mode is enabled in Roady. This is to ensure that you're not getting spammed with fake tickets and upvotes. However, some may want to remove the friction that comes with authenticating with Google. In that case, you can turn `auth-mode` off in the `roady.config.ts` file. like so:

```ts
// roady.config.ts
const config = {
  authMode: "true",
};

export default config;
```

If you want to run Roady in auth mode, then just set the `authMode` to true. As mentioned above, you'll need to create a Google OAuth application and pass in the `GOOGLE_ID` and `GOOGLE_SECRET` as environment variables.

On startup, Roady will read in the configs from this file and configure itself accordingly.

## Moving to production

If you're using NextJS, you can ingest the project into your existing NextJS project and make the main `page.tsx` file available at a route such as `/roadmap`. Otherwise, you can run Roady separately and, for example, host it on a subdomain such as `roadmap.xyz.com` redirect to it on link/button click.

## Roady Roadmap

1. Track which users submit/upvote tasks and save to ticket metadata only for auth mode
2. Support multi-image uploads to tasks
3. Allow users to set a flag to not show a specific issue in the public roadmap
