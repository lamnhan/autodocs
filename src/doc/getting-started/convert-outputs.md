A [[DeclarationObject]] supports certain convert output depended on its kind. You can also provide your custom converts output, use the `converts` field of [[Options]]. 

## Default outputs

Here the list of default output:

| Output | Kinds | Options | Description |
| --- | --- | --- | --- |
| __SECTION:`ID`__ | any | [[ConvertingOptions]] | A local section |
| __CONTENT__ | any | [[ConvertingOptions]] | The text content |
| __VALUE__ | `Variable`, `Property` | [[ValueOptions]] | Default value |
| __SELF__ | any | [[DeclarationOptions]], [[ConvertingOptions]], [[HeadingOptions]] | Title, description, content WITHOUT local sections, parameters & returns (for function) |
| __FULL__ | any | [[DeclarationOptions]], [[ConvertingOptions]], [[HeadingOptions]], [[FilterOptions]] | All content (with headings) |
| __SUMMARY_VARIABLES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table of variables |
| __DETAIL_VARIABLES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Detail list of variables |
| __FULL_VARIABLES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table & detail list of variables |
| __SUMMARY_FUNCTIONS__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table of functions |
| __DETAIL_FUNCTIONS__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Detail list of functions |
| __FULL_FUNCTIONS__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table & detail list of functions |
| __SUMMARY_PROPERTIES__ | `Interface`, `Class` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table of properties |
| __DETAIL_PROPERTIES__ | `Interface`, `Class` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Detail list of properties |
| __FULL_PROPERTIES__ | `Interface`, `Class` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table & detail list of properties |
| __SUMMARY_METHODS__ | `Class` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table of methods |
| __DETAIL_METHODS__ | `Class` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Detail list of methods |
| __FULL_METHODS__ | `Class` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table & detail list of methods |
| __SUMMARY_INTERFACES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table of interfaces |
| __DETAIL_INTERFACES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Detail list of interfaces |
| __FULL_INTERFACES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table & detail list of interfaces |
| __SUMMARY_CLASSES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table of classes |
| __DETAIL_CLASSES__ | `Collection`| [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Detail list of classes |
| __FULL_CLASSES__ | `Collection` | [[DeclarationOptions]], [[ConvertingOptions]], [[FilterOptions]] | Summary table & detail list of classes |

Provide options with the third item of a rendering input:

- Custom [[DeclarationObject]] id: `{ id }`
- **SELF** output heading: `{ title, link }`
- Raw object for default value: `{ raw: true }`
- Change base level: `{ level }`
- Show the default headings: `{ heading: true }`
- Use local anchors (instead of ref links): `{ local: true }`
- Filter children: `{ filter: [[DeclarationFilter]] }`
- Any custom key-value pairs

## Custom output

You can also provide your custom convert function, see [[CustomConvert]].

A custom convert function recieves these params:

- [[DeclarationObject]]: the declaration
- [[ConvertOptions]]: any convert options
- [[ContentService]]: a content service instance

The result can be a `string` or an array of [[ContentBlock]].
