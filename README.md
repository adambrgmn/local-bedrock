# WordPress Bedrock/Local template

A template to work with [Roots Bedrock](https://roots.io/bedrock/) and
[Local by Flywheel](https://local.getflywheel.com/). Forked and inspired from
[artifex404/local-bedrock](https://github.com/artifex404/local-bedrock)

## Installation

1. Clone this repo (and remove unnecessary files): `git clone --depth=1
   https://github.com/adambrgmn/local-bedrock && rm -rf local-bedrock/.git
   local-bedrock/README.md local-bedrock/.gitignore`
1. Copy `.env.example` to `.env`: `cp local-bedrock/app/public/.env.example
   local-bedrock/app/public/.env`
1. Update `WP_HOME` to match your new site name
1. Generate new salts at
   [https://roots.io/salts.html](https://roots.io/salts.html)
1. Zip the directory: `cd local-bedrock && zip -r ../local-bedrock.zip . * && cd
   ..`
1. Drag and drop `local-bedrock.zip` onto the Local by Flywheel app
1. Enter details for new site (Make sure to select a **Custom environment**
   together with **nginx**)
1. Go to your newly created site and the `public`-directory and run `composer
   install`

That should give you a fully working WordPress site backed by Bedrock and Local
by Flywheel

Make sure to save this as a Blueprint to easily create new sites.

## Recommended development

### Git

You should probably not make the full site created by Local as a git repository.
Instead my recommendation is to initialize a new repository inside the
`public`-directory

### Make it work on shared hosting

This template was mainly created to make Bedrock work with Local. But also to be
able to easily push this new site to a shared hosting solution that uses Apache.
Therefore a few extra things are included.

A few things need to be provided to make it work on shared hosting.

1. Update `.htaccess` inside the `public`-directory
1. Change every occurence (2 times) of `^(www.)?example.com$` to
   `^(www.)?your_site_name.whatever$`
1. Add FTP credentials to `.env`
1. If not doen before run `npm install` or `yarn install` to install node
   dependencies
1. Run `./scripts/deploy.sh` from inside the `public`-directory

Now your site should be up and running on your shared host

## Extra

The repo also includes a `.travis.yml`-file. Build on this to setup CI on
[Travis CI](https://travis-ci.org/)
