# Developer Portal

## Run

### Against preproduction

1. Make sure your localhost is mapped to `developer-local.cloud.appctest.com` in `/etc/hosts`:

		127.0.0.1	developer-local.cloud.appctest.com

2. Make sure you're logged into preproduction:

		appc config set defaultEnvironment preproduction && appc login

2. Run the app:

		appc run

### Against production

1. Make sure your localhost is mapped to `developer-local.appcelerator.com` in `/etc/hosts`:

		127.0.0.1	developer-local.appcelerator.com

2. Make sure you're logged into production:

		appc config set defaultEnvironment production && appc login

2. Run the app:

		appc run

## Develop

### Build CSS (LESS) & JS

The [styles.css](web/public/css/styles.css) is generated from [default.less](web/src/less/default.less) which imports Bootstrap. The [Gruntfile](Gruntfile.js) registers tasks to generate the css:

```
grunt css
```

Add any Bootstrap JS plugins and other scripts like [default.js](web/src/js/default.js) to the list in the [Gruntfile](Gruntfile.js) and then run the js-task to concat and uglify them:

```
grunt js
```

Or keep an additional terminal window open and watch for LESS/JS changes:

```
grunt dev
```

## Publish
The [Gruntfile](Gruntfile.js) has a task to build CSS/JS, unpublish previous versions, bump the patch version of the [package.json](package.json) and then publish the new version.

> **NOTE:** Make sure you are logged into the right environment and organization.

```
grunt publish
```
