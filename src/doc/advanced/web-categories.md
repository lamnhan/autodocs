You may want to group some articles into one category by create the category and put any file under the category id:

```ts
{
  webRender: {
    categories: {
      cat1: 'Category 1'
    },
    files: {
      'cat1/file1.html': 'basic',
      'cat1/file2.html': '@doc/file2.md'
    }
  }
}
```

Any files under a category id will be render as they are children of the category.