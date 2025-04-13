---
title: Localization
description: Implement multi-language support in Intent.js applications with our comprehensive localization guide. Learn to manage translations, handle pluralization, and format content for global audiences with practical examples and best practices.
keywords: Intent.js localization, internationalization, i18n, multi-language support, translations, pluralization, language formatting, global applications
image:
---

# Localization

There might be situations where you want to change the text sent to the client as per their chosen locale, this is where localization feature by Intent will help you. It comes with a ridiculously simple API to use it.

Intent provides a convenient way to retrieve strings in various languages, allowing you to easily support multiple languages within your application.

Language strings are stored in `json` files within the a single directory `resources/lang` by default, but you are free to change it as per your need. Within this directory, the translation strings are to be defined in JSON files. Each language supported by your application would have a corresponding JSON file within this directory. This approach is recommended for application's that have a large number of translatable strings.

Languages and their corresponding `.json` files are identified by their <Link href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" className='text-primary'>ISO-639-1</Link> codes.

Recommended directory structure :

<FileTree>
  <FileTree.Folder name="resources" defaultOpen>
    <FileTree.Folder name="lang" defaultOpen>
      <FileTree.File name="en.json" />
      <FileTree.File name="hi.json" />
    </FileTree.Folder>
  </FileTree.Folder>
</FileTree>

## Configuration

The configuration for localization is stored at `config/locale.ts`.

```ts
import { configNamespace } from "@intentjs/core/config";

export default configNamespace("localization", () => ({
  fallbackLang: "en",
  path: "resources/lang",
}));
```

## Defining Translation Strings

Typically, translation strings are stored in files within the `resources/lang` directory. Within this directory you'll have JSON files contianing the key value pairs for a particular language.
For example, if your application has a English translation, you should create a `resources/lang/en.json` file:

```json
// en.json
{
  "quote": "If your dreams do not scare you, they are already becoming a reality."
}
```

For applications with a large number of translatable strings, defining every string with a "short key" can become confusing when referencing the keys in your views and it is cumbersome to continually invent keys for every translation string supported by your application.

For example, if your application has a Hindi translation, you should create a `resources/lang/hi.json` file:

```json
// hi.json
{
  "quote": "अगर आपके सपने आपको नहीं डरा रहे हैं, तो वो पहले से पुरे होने लग चुके हैं।"
}
```

You can also nest your strings inside the json file.

```json
// en.json
{
  "greetings": {
    "morning": "Good Morning",
    "evening": "Good Evening"
  }
}
```

:::warning
You should not create conflicting keys i.e 2 keys should not have the same name.
:::

## Retrieving Translation Strings

Now that our translation files are created, we will now see how to fetch the string using our `__` function.

You can retrieve translation strings from your language files using the `__` helper function. The `__` function takes 1 required arguments, the key of the translation string you wish.

You can use the dot `.` notation to refer to nested strings. Let's take a look at different ways of retrieving the values.

```ts
import { __ } from "@intentjs/core/locale";

__("quote");
// If your dreams do not scare you, they are already becoming a reality.

__("quote", "hi");
// अगर आपके सपने आपको नहीं डरा रहे हैं, तो वो पहले से पुरे होने लग चुके हैं।

__("greetings.morning");
// Good Morning

__("randomKey", "en");
// randomKey
```

### Replacing Parameters In Translation Strings

If you wish, you may define placeholders in your translation strings. All placeholders are prefixed with a `:`. For example, you may define a personalized hello message with a placeholder name:

```json
// en.json

{
  "hello": "Hello, :name"
}
```

To replace the placeholders when retrieving a translation string, you may pass an array of replacements as the second argument to the `__` function:

```javascript
__("hello", { name: "vinayak" }); // returns => Hello, vinayak
```

If your placeholder contains all capital letters, or only has its first letter capitalized, the translated value will be capitalized accordingly:

```json
{
  "hello": "Hello, :Name", // Hello, Vinayak
  // OR
  "hello": "Hello, :NAME" // Hello, VINAYAK
}
```

### Pluralization

Intent can also help you translate strings differently based on pluralization rules that you define. Using a `|` character as a delimiter, you may distinguish singular and plural forms of a string:

```json
// en.json
{
  "apples": "There is one apples|There are many apples"
}
```

You may even create more complex pluralization rules which specify translation strings for multiple ranges of values:

```json
{
  "apples": "[0] There is no apple|[1,10] There are some apples|[11,*] There are many apples"
}
```

After defining a translation string that has pluralization options, you may use the `transChoice` function to retrieve the line for a given "count".
In the below example, since the count is greater than one, the plural form of the translation string is returned:

```ts
transChoice("apples", 10);
// There are some apples
```

If you want to specify the lang, you can pass the `lang` as 2nd argument and `count` as 3rd argument.

```ts
transChoice("apples", "hi", 10);
// वहाँ कुछ सेब हैं
```

:::info
The count agrument is required for `tranChoice`
:::

You may also define placeholder attributes in pluralization strings. These placeholders may be replaced by passing an array as the third argument to the `transChoice` function:

```json
// en.json
{
  "minutes_ago": "[1] :value minute ago|[2,*] :value minutes ago"
}
```

```javascript
transChoice("minutes_ago", 10, { value: 10 });
// 5 minutes ago
```

If you would like to display the integer value that was passed to the `transChoice` function, you may use the built-in `:count` parameter:

```json
// en.json
{
  "apples": "[0] There are none|[1] There is one|[2,*] There are :count apples"
}
```

```javascript
transChoice("apples", 30);
// There are 30 apples
```
