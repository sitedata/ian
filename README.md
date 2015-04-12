# ian

## Android specific building

First, you need to setup a keystore. Inside the keystore, you can put your private keys that you need to sign the app with.

To create a keystore and a key, you can use this command to create a RSA key with 2048 bits and a validity of 10000 days:

```
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
```

## Config

You can add a `config.json` file in the root of the project to easily update the texts from a spreadsheet and have a easy way to sign your Android app.

### Settings for the keystore / key for Android

When setting up the `config.json`, you can add a `key` object for Android specific signing. If you use a relative path to the store, don't forget that it starts in the directory `${PROJECT_DIR}/platforms/android/`.

### Settings for the random texts

There are three settings that need to be set for the texts.

1. `outputJson` - In our case, this should always be `src/js/texts.json`. It will overwrite the existing texts with the new ones it reads from Google Spreadsheets.
2. `sheetId` - The spreadsheet id.
3. `workheetIds` - An array of the worksheets to use from the Google Spreadsheet.

It is crucial that the spreadsheet is shared for everyone. Otherwise the `gulp texts` task won't be able to download.

### Full example

Here is a full example for a `config.json`:

```
{
  "key" : {
    "store" : "../../my-release-key.keystore",
    "storePassword" : "password-for-store",
    "alias" : "alias_name",
    "aliasPassword" : "password-for-key"
  },
  "outputJson" : "src/js/texts.json",
  "sheetId" : "1TmeO6jsf53wrvAbGfN0UrQn7Ycn3G7lNMffVvuBbXTg",
  "worksheetIds" : [
    "0"
  ]
}
```
