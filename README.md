# Roady

Roady is an open source public roadmap that allows users to submit new tasks and upvote existing tasks.

Roady uses Linear as a back-end and does not have its own database.

## Features

1. Users can submit tasks that automatically get created in Linear
2. Users can upvote tasks which automatically gets recorded in Linear
3. Google OAuth authentication for task submission and upvoting to ensure that only real users can submit new tasks and upvote existing tasks.
4. Users can include inline code snippets and code blocks in their task submissions
5. Users can attack images to their task submissions
6. Roadmap style view with different stages that are automatically tracked through Linear

## Getting Started

In order to run Roady, you'll need a few things:

1. Linear API Key -> this is used to talk to your Linear instance. To create a new Linear api key, follow [these instructions](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#authentication) and create a Personal API Key.
2. Google OAuth credentials - if you're running Roady in auth mode, you'll need Google OAuth credentials. Follow [this guide](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) to create Google OAuth credentials and an application. Make sure that you set the right scopes. Set these as environment variables so that roady can read them in.
3. Linear Project Name - Roady pulls issues from a given linear project. Include the name of the project that you want to render your public tickets and set it as an environment variable named `PROJECT_NAME`. For example, `PROJECT_NAME="Public Roadmap"`
4. Auth secret - you can create an auth secret by running `openssl rand -base64 33` in your terminal and copying and pasting the resulting string into an environment variables called `AUTH_SECRET`.

### Environment Variables

Once you have your credentials and linear api keys, set them as environment variables in a `.env.` file. For example,

```bash

LINEAR_API_KEY=XXXX
PROJECT_NAME="Public Roadmap"
GOOGLE_ID=XXXXX
GOOGLE_SECRET=XXXXX
NEXTAUTH_URL=http://localhost:3001 #update to include your actual URL here
AUTH_SECRET="XXXX" # Added by `npx auth`. Read more: https://cli.authjs.dev

```

## Running Roady in un-Auth mode

By default, auth mode is enabled in Roady. This is to ensure that you're not getting spammed with fake tickets and upvotes. However, some may want to remove the friction that comes with authenticating with Google. In that case, you can turn `auth-mode` off in the `roady.config.ts` file. like so:

```ts
// roady.config.ts
const config = {
  authMode: "true",
};

export default config;
```

On startup, Roady will read in the configs from this file and configure itself accordingly.

## Roady Roadmap

1. Track which users submit tasks and upvote tasks and save to ticket only for auth mode
2. OAuth seems to sometimes not pick up the cookie on page refresh, probably no refresh token is persisting
