---
title: Helpers
description:
image:
---

<script setup>
  import {
  ArrayHelpersList,
  NumberHelpersList,
  ObjectHelpersList,
  StringHelpersList,
} from "../utils/helpers";
// import HelpersList from '../components/HelpersList';
</script>

# Helpers

IntentJS comes packed with helper methods which you can use to abstract many trivial tasks from your main piece of code.

IntentJS provides the following helpers

- [Arrays](#arrays)
- [Objects](#objects)
- [Numbers](#numbers)
- [Strings](#strings)

## Available Methods

### Arrays

<HelpersList :items="ArrayHelpersList" />

### Objects

<HelpersList :items="ObjectHelpersList" />

### Numbers

<HelpersList :items="NumberHelpersList" />

### Strings

<HelpersList :items="StringHelpersList" />

## Array Helper Methods

### collapse [#arr-collapse]

You can use `Arr.collapse` method to collapse a nested array into a single level.

```ts
Arr.collapse(['a', ['b', ['c'], 1], 2]);

// [ 'a', 'b', 'c', 1, 2 ]
```

### except [#arr-except]
The `Arr.except` is a method which you can use to remove some index, or keys from an array of objects.

```ts
const goats = [
  { name: 'Saina Nehwal', sport: 'Badminton' },
  { name: 'Sunil Chetri', sport: 'Football' },
  { name: 'Rohit Sharma', sport: 'Cricket' },
  { name: 'Virat Kohli', sport: 'Cricket' },
];

Arr.except(goats, ['*.sport']);
/**
  [
    { name: 'Saina Nehwal' },
    { name: 'Sunil Chetri' },
    { name: 'Rohit Sharma' },
    { name: 'Virat Kohli' }
  ]
*/

Arr.except(goats, ['2.sport'])
/**
  [
    { name: 'Saina Nehwal', sport: 'Badminton' },
    { name: 'Sunil Chetri', sport: 'Football' },
    { name: 'Rohit Sharma' },
    { name: 'Virat Kohli', sport: 'Cricket' }
  ]
*/
```

### pick [#arr-pick]
Unlike `Arr.except`, you can use `Arr.pick` method to only pick selected indices, keys from an array.

```ts
const goats = [
  { name: 'Saina Nehwal', sport: 'Badminton' },
  { name: 'Sunil Chetri', sport: 'Football' },
  { name: 'Rohit Sharma', sport: 'Cricket' },
  { name: 'Virat Kohli', sport: 'Cricket' },
];

Arr.pick(goats, ['*.name']);
/**
  [
    { name: 'Saina Nehwal' },
    { name: 'Sunil Chetri' },
    { name: 'Rohit Sharma' },
    { name: 'Virat Kohli' }
  ]
*/

Arr.pick(goats, ['0.name', '1.sport', '2.name', '3.sport']);
/**
  [
    { name: 'Saina Nehwal' },
    { sport: 'Football' },
    { name: 'Rohit Sharma' },
    { sport: 'Cricket' }
  ]
*/
```

### random [#arr-random]
The `Arr.random` method shuffles the elements of an array.

```ts
const goats = [
  { name: 'Saina Nehwal', sport: 'Badminton' },
  { name: 'Sunil Chetri', sport: 'Football' },
  { name: 'Rohit Sharma', sport: 'Cricket' },
  { name: 'Virat Kohli', sport: 'Cricket' },
];

Arr.random(goats);

/**
  [
    { name: 'Virat Kohli', sport: 'Cricket' },
    { name: 'Rohit Sharma', sport: 'Cricket' },
    { name: 'Saina Nehwal', sport: 'Badminton' },
    { name: 'Sunil Chetri', sport: 'Football' }
  ]
*/
```

### toObj [#arr-to-obj]

The `Arr.toObj` method transforms the array to an object.

```ts
const array = [
  ["The Alchemist", "Paulo Coelho"],
  ["Shoe Dog", "Phil Knight"],
];

const obj = Arr.toObj(array, ["book", "author"]);

/**
  [
    { book: 'The Alchemist', author: 'Paulo Coelho' },
    { book: 'Shoe Dog', author: 'Phil Knight' }
  ]
*/
```

## Object Helper Methods

### dot [#obj-dot]

The `Obj.dot` converts a nested object to dot notation object

```typescript
const obj = {
  name: { fullName: "Vinayak", lastName: "Sarawagi" },
  address: { country: "India", code: "IN" },
};

const dotObj = Obj.dot(obj);
/**
{
  'name.fullName': 'Vinayak',
  'name.lastName': 'Sarawagi',
  'address.country': 'India',
  'address.code': 'IN'
}
*/
```

### entries [#obj-entries]

The `Obj.entries` method converts a deeply nested object into a \[key, value] array. If the object is nested, it would automatically convert the obj to dot notation.

```typescript
const obj = {
  id: 1,
  name: { fullName: "Vinayak", lastName: "Sarawagi" },
  address: { country: "India", code: "IN" },
};

const objEntries = Obj.entries(obj);
/**
[
  [ 'id', 1 ],
  [ 'name.fullName', 'Vinayak' ],
  [ 'name.lastName', 'Sarawagi' ],
  [ 'address.country', 'India' ],
  [ 'address.code', 'IN' ]
]
*/
```

### except [#obj-except]

The `Obj.except` method helps you quickly get a new object except the list of keys that you specify.
```ts
const obj = {
  firstName: 'Vinayak',
  lastName: 'Sarawagi',
  email: 'vinayak@tryintent.com',
  wishlist: [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
  ],
  address: {
    line1: 'Somewhere',
    line2: 'Far Far Away',
    city: 'Delhi',
    country: { code: 'IN', name: 'India' },
  },
};

Obj.except(obj, ['firstName', 'lastName', 'wishlist.*.id']);
/**
  {
    email: 'vinayak@tryintent.com',
    wishlist: [
      { name: 'Product 1' },
      { name: 'Product 2' },
      { name: 'Product 3' }
    ],
    address: {
      line1: 'Somewhere',
      line2: 'Far Far Away',
      city: 'Delhi',
      country: { code: 'IN', name: 'India' }
    }
  }
 */
```

### get [#obj-get]

The `Obj.get` method can be used to fetch a value from an object by using dot notation.

```ts
const obj = {
  firstName: 'Vinayak',
  lastName: 'Sarawagi',
  email: 'vinayak@tryintent.com',
  wishlist: [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
  ],
  address: {
    line1: 'Somewhere',
    line2: 'Far Far Away',
    city: 'Delhi',
    country: { code: 'IN', name: 'India' },
  },
};

Obj.get(obj, 'firstName'); 
// Vinayak

Obj.get(obj, 'wishlist.0.name'); 
// Product 1

Obj.get(obj, 'address.country.name');
// India
```

### isEmpty [#obj-is-empty]
To check if an object is empty, you can make use of `Obj.isEmpty` method.

```ts
Obj.isEmpty({ name: 'Intent' });
// false

Obj.isEmpty({});
// true

Obj.isEmpty([]);
// true
```

### isNotEmpty [#obj-is-not-empty]
Incase you want to check if an object is not empty, `Obj.isNotEmpty` can help you.

```ts
Obj.isNotEmpty({ name: 'Intent' });
// true

Obj.isNotEmpty({});
// false

Obj.isNotEmpty([]);
// false
```
### pick [#obj-pick]

There will be cases where you would like to access multiple keys at once using dot notation. To do so you can use `Obj.pick` method.

```ts
const obj = {
  firstName: "Vinayak",
  lastName: "Sarawagi",
  email: "vinayak@tryintent.com",
  wishlist: [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ],
  address: {
    line1: "Somewhere",
    line2: "Far Far Away",
    city: "Delhi",
    country: { code: "IN", name: "India" },
  },
};

Obj.pick(obj, ["firstName", "lastName", "wishlist.*.id"]);
/**
 *  {
 *    firstName: 'Vinayak',
 *    lastName: 'Sarawagi',
 *    wishlist: [ { id: 1 }, { id: 2 }, { id: 3 } ]
 *  }
 */
```

## Number Helper Methods

All of the number helpers are exported from `import { Num } from '@intentjs/core'`

### abbreviate [#num-abbreviate]

The abbreviate method returns the human-readable format of the provided numerical value.

```typescript
import { Num } from "@intentjs/core";

Num.abbreviate(1000);
// 1K

Num.abbreviate(1200, { precision: 2 });
// 1.2K

Num.abbreviate(1200, { locale: "hi" });
// 1.2 हज़ार
```

### clamp [#num-clamp]

Clamp helper allows you to ensure that the given number remains within the specified range. f the number is lower than the minimum, the minimum value is returned. If the number is higher than the maximum, the maximum value is returned:

```typescript
Num.clamp(80, 20, 100);
// 80

Num.clamp(10, 20, 100);
// 20

Num.clamp(5, 20, 100);
// 20

Num.clamp(110, 20, 100);
// 100
```

### currency [#num-currency]

Currency helper returns the currency format of a given number.

```typescript
Num.currency(12300);
// ₹12,300.00

Num.currency(12300, { currency: "USD" });
// $12,300.00
```

### fileSize [#num-file-size]

The `fileSize` method returns the file size representation of the number passed.

```typescript
Num.fileSize(1000);
// 1KB

Num.fileSize(1024);
// 1KB

Num.fileSize(1024 * 1024 * 1.5, { precision: 2 });
// 1.57MB
```

### forHumans [#num-for-humans]

`forHumans` method returns the expanded human-readable format of the given number.

```typescript
Num.forHumans(100);
// 100

Num.forHumans(1200);
// 1.2 thousand

Num.forHumans(1230, { precision: 2 });
// 1.23 thousand

Num.forHumans(1230, { locale: "en" });
// 1,2 millier
```

### format [#num-format]

The `format` method formats the number into the given locale string.

```typescript
Num.format(1000);
// 1,000

Num.format(1000, { locale: "fr" });
// 1 000

Num.format(1200);
// 1,200
```

### ordinal [#num-ordinal]

Ordinal method returns the ordinal format of a number.

```typescript
Num.ordinal(1);
// 1st

Num.ordinal(2);
// 2nd

Num.ordinal(3);
// 3rd

Num.ordinal(20);
// 20th
```

### percentage [#num-percentage]

`Num.percentage` method formats the given value into a percentage string.

```typescript
Num.percentage(10);
// 10.0%

Num.percentage(10, { locale: "fr" });
// 10,0 %

Num.percentage(10.123, { precision: 2 });
// 10.12%
```

## String Helper Methods

### after [#str-after]

The `Str.after` method returns the string after the specified `substr`.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

const result = Str.after(sentence, "fox");
// jumps over a lazy dog.
```

### before [#str-before]

The `Str.after` method returns the string before the specified `substr`, excluding the `subtr`.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

const result = Str.before(sentence, "fox");
// The quick brown
```

### between [#str-between]

The `Str.between` method returns the string present between the specified `start` and `end`.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

const result = Str.between(sentence, "brown", "jumps");
// fox
```

### camel [#str-camel]

The `Str.camel` method converts given string into it's `camelCase` representation.

```ts
const example0 = "intent_js";
Str.camel(example0); // intentJs

const example1 = "quick brown fox jumps";
Str.camel(example1); // quickBrownFoxJumps

const example2 = "Hey_there, What's up?";
Str.camel(example2); // heyThereWhatSUp
```

### contains [#str-contains]

You can use `Str.contains` method to check if specified `str` is present in a given string.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.contains(sentence, "over"); // returns true

Str.contains(sentence, "over2"); // returns false
```

### containsAll [#str-contains-all]

If you want to search for all specified `str`s to be present in the given string, you can use `Str.containsAll` method.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.containsAll(sentence, ["fox", "dog"]); // returns true

Str.containsAll(sentence, ["fox", "whale"]); // returns false
```

### endsWith [#str-ends-with]

In cases where you want to check if given string ends with a `substr`, you can use `Str.endsWith` method.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.endsWith(sentence, "dog."); // returns true
```

### headline [#str-headline]

`Str.headline` method converts the given string into HeadLine case. This also strips all special characters.

```ts
const sentence = "Is this real?";

Str.headline(sentence); // Is This Real?
```

### is [#str-is]

`Str.is` method can be used for pattern matching a substr with given string, or even for exact matching as well.

```ts
const str = "users:create";

Str.is(str, "users:create"); // true

Str.is(str, "*:create"); // true

Str.is(str, "admin"); // false
```

### isEmail [#str-is-email]

`Str.isEmail` method validates if given string is an email or not.

```ts
Str.isEmail("hi@tryintent.com"); // true

Str.isEmail("tryintent.com"); // false
```

### isJson [#str-is-json]

`Str.isJson` method validates if the given string can be parsed into `JSON` format or not.

```ts
Str.isJson('{"name": "Intent"}'); // true

Str.isJson('{"name": "Intent"'); // false
```

### isUrl [#str-is-url]

`Str.isUrl` method checks if the given string is a valid URL or not.

```ts
Str.isUrl("https://tryintent.com"); // true

Str.isUrl("tryintent.com"); // true

Str.isUrl("docs.tryintent.com"); // true

Str.isUrl("http2://tryintent.com"); // false
```

### isUlid [#str-is-ulid]

You can use `Str.isUlid` to verify if the given string obeys `ULID` format or not.

```ts
Str.isUlid("01ARZ3NDEKTSV4RRFFQ69G5FAV"); // true

Str.isUlid("admin"); // false
```

### kebab [#str-kebab]

`Str.kebab` method converts the given string into `kebab-case`.

```ts
const example0 = "intent_js";
Str.kebab(example0); // intent-js

const example1 = "quick brown fox jumps";
Str.kebab(example1); // quick-brown-fox-jumps

const example2 = "Hey_there, What's up?";
Str.kebab(example2); // hey-there-what-s-up
```

### lcfirst [#str-lcfirst]

`Str.lcfirst` can be used to convert the first character to lowercase.

```ts
Str.lcfirst("INTENT"); // iNTENT

Str.lcfirst("Intent"); // intent
```

### length [#str-length]

You can use `Str.len` to get the length of a given string.

```ts
Str.len("intent"); // 6

Str.len(undefined); // 0
```

### limit [#str-limit]

If you want only `n` length of characters from a given string, you can use `Str.limit` method.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.limit(sentence, 15);
// The quick brown...

Str.limit(sentence, 15, "!!!");
// The quick brown!!!

Str.limit(sentence, 50);
// The quick brown fox jumps over a lazy dog.
```

### lower [#str-lower]

`Str.lower` transforms the given string into lower case.

```ts
Str.lower("VINAYAK SARAWAGI");
// vinayak sarawagi
```

### mask [#str-mask]

You can use `Str.mask` method to mask a given string.
First argument accepts a string, 2nd argument accepts the masked character,
and the 3rd one accepts the number of characters which should be left as it is,
the rest of it will be masked.

```ts
Str.mask("hi@tryintent.com", "*", 7);
// hi@tryi*********
```

### padBoth [#str-pad-both]

You can use `Str.padBoth` method to pad your strings from both the ends with given `char` to a defined length.

```ts
Str.padBoth("intent", 10, "~");
// ~~intent~~
```

### padLeft [#str-pad-left]

Similar to `Str.padBoth`, but if you want to just pad the left side of the string, you can use `Str.padLeft` method.

```ts
Str.padLeft("intent", 10, "~");
// ~~~~intent
```

### padRight [#str-pad-right]

Similar to `Str.padBoth`, but if you want to just pad the right side of the string, you can use `Str.padRight` method.

```ts
Str.padRight("intent", 10, "~");
// intent~~~~
```

### pluralize [#str-pluralize]
The `Str.plural` method converts a given method to a plural form.

```ts
Str.pluralize('apple');
// apples

Str.pluralize('child');
// children

Str.pluralize('index');
// indices

Str.pluralize('alumnus');
// alumni
```

### remove [#str-remove]

If you want to just remove certain characters from a given string, `Str.remove` can do that for you.

```ts
Str.remove("New OSS NodeJS Framework", "OSS ");
// New NodeJS Framework
```

### repeat [#str-repeat]

`Str.repeat` method returns a new string with `repeat` string for `x` times.

```ts
Str.repeat("chug ", 5);
// chug chug chug chug chug
```

### replace [#str-replace]
The `Str.replace` method can be used to replace a given string with another string.

```ts
Str.replace('I hate intent!', 'hate', 'love');
// I love intent!

Str.replace('I Hate intent!', 'hate', 'love', true);
// I love intent!
```

### replaceArray [#str-replace-array]
The `Str.replaceArray` method replaces the matching string sequentially with the string array.

```ts
const str = 'I will be there between ? and ?';

Str.replaceArray(str, '?', ['8:30', '9:30PM']);
// I will be there between 8:30 and 9:30PM;
```

### replaceFirst [#str-replace-first]
The `Str.replaceFirst` method replaces only the first matching string with the replacement string.

```ts
const sentence = 'the quick brown fox jumps over the lazy dog.';

Str.replaceFirst(sentence, 'the', 'a');
// a quick brown fox jumps over a lazy dog.
```

### replaceLast [#str-replace-last]
The `Str.replaceLast` method can be used to replace only the last matching string with the replacement string.

```ts
const sentence = 'the quick brown fox jumps over the lazy dog.';

Str.replaceLast(sentence, 'the', 'a');
// the quick brown fox jumps over a lazy dog.
```

### reverse [#str-reverse]

`Str.reverse` reverses the string.

```ts
Str.reverse("wtf! why reverse?");
// ?esrever yhw !ftw
```

### singular [#str-singular]

You can use `Str.singular` to convert a given word in a singular form.

```ts
Str.singular('apples');
// apple

Str.singular('children');
// child

Str.singular('indices');
// index

Str.singular('matrices');
// matrix
```

### slug [#str-slug]

You can use `Str.slug` method to convert any string to a slug form.

```ts
const title = "How to get started with IntentJS? 🤨";

Str.slug(title);
// how-to-get-started-with-intent

Str.slug("hello there");
// hello-there
Str.slug("Hey_there, What's up?");
// hey-there-what-s-up

Str.slug("@@@@@@jell----fw  fed");
// jell-fw-fed
```

### snake [#str-snake]

`Str.snake` transforms the given string into `snake_case`.

```ts
const title = "How to get started with IntentJS? 🤨";

Str.snake(title);
// how_to_get_started_with_intent
```

### startsWith [#str-starts-with]

If you want to check if any string starts with a `substr` or not.

```ts
Str.startsWith("A Product Stack Framework", "A Product");
// true
```

### swap [#str-swap]

You can use `Str.swap` method to swap multiple words with some other words.

```ts
Str.swap("Butter Chicken", { Butter: "Chilli", Chicken: "Paneer" });
// Chilli Paneer
```

### take [#str-take]

The `Str.take` method returns the specified number of chars from the beginning of the string.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.take(sentence, 9);
// The quick
```

### title [#str-title]

The `Str.title` converts the given string into `Title` format.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.title(sentence);
// The Quick Brown Fox Jumps Over A Lazy Dog.
```

### toBase64 [#str-to-base64]

The `Str.toBase64` converts the string into base64 format.

```ts
const sentence = "The quick brown fox jumps over a lazy dog.";

Str.toBase64(sentence);
// VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIGEgbGF6eSBkb2cu
```

### ucfirst [#str-ucfirst`]

The `Str.ucFirst` returns the string with it's first character capitalized.

```ts
Str.ucfirst("hey intent");
// Hey intent
```

### words [#str-words]

The `Str.words` method returns the words present in the given sentence. It can also ignore the special characters, and unicodes.

```ts
const sentence = "fox & dog";
Str.words("fox & dog");
//  [ 'fox', '&', 'dog' ]

Str.words("fox@&@dog", true); // <- strips all special characters and unicodes
// [ 'fox', 'dog' ]

Str.words("fox🤨and🤨dog", true);
// [ 'fox', 'and', 'dog' ]
```

### wrap [#str-wrap]

The `Str.wrap` function wraps the strings in `prefix` and `suffix`.

```ts
Str.wrap(" Love ", "I", "Intent");

// I Love Intent
```
