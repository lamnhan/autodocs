Using template is the easiest way to generate a file.

You can generate a file using the CLI command, for example:

```sh
ayedocs generate TEST.md -t basicx
```

## Built-in templates

List of built-in templates, add the `x` suffix for extra builtin sections (`head`, `tocx`, `license`):

- `basic`/`basicx`: Show `Options` & `Main` for a **seminjecto** library.
- `full`/`fullx`: Show all `functions`, `interfaces`, `classes`.
- `angular`/`angularx`: Listing modules, services, components, pipes for an Angular lib.
- `cli`/`clix`: Listing commands for a **seminjecto** CLI app.

## Custom template

You can also provide your custom template, see [[CustomTemplate]]:

A custom template function recieves these params:

- [[TemplateOptions]]: any options
- [[TemplateService]]: a template service instance
- [[ContentService]]: a content service instance
- [[ProjectService]]: a project service instance

The result is an [[AdvancedRendering]].
