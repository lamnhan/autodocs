A [[Declaration]] supports certain convert output depended on its kind. You can also provide your custom converts output, use the `converts` field of [[Options]]. 

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

- Declaration id: `{ id }`
- **SELF** header: `{ title, link }`
- Raw object: `{ raw: true }`
- Level: `{ level }`
- Use the default heading: `{ heading: true }`
- Use local anchors (instead of detail links): `{ local: true }`