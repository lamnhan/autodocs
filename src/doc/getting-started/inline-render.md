You can include declaration render inline by using these formats (without `\`):

- `\[\[\[Main]]]`: equals `["Main"]`
- Or `\[\[\[Options | FULL | {"title":"The Options"}]]]`: equals `["Options", "FULL", { title: 'The Options' }]`
- Or `\{\@render Main}`
- Or `\{\@render Options | FULL | {"title":"The Options"}}`
