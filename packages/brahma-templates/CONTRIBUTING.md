# Contributing to Template Repository

Checkout an example [here](/packages/brahma-templates/src/templates/drain-account/index.tsx)

Example Structure

```bash
/src
  ├── /templates
  │   ├── /my-custom-template
  │   │   ├── index.tsx
  │   │   └── image.png
  ├── index.ts
  └── types.ts
```

## Configuring the Custom Template

Each template must export a configuration object that defines its properties and behavior:

1. Edit `index.tsx` in your custom template folder to define the main component logic.
2. Create the Template Configuration:

```tsx
const createTemplateConfig = (getClientFactory, addToTxnBuilder) => ({
  name: "My Custom Template",
  description: "Description of the custom template",
  getCustomView: () => <MyCustomTemplateComponent getClientFactory={getClientFactory} addToTxnBuilder={addToTxnBuilder} />,
  bgImage: image,
  docs: "https://docs-link.com",
  isBeta: false,
  comingSoon: false,
  type: "Template",
  supportedChains: [arbitrum.id],
});

export default createTemplateConfig;
```

3. Register Your Template:
   - Import your custom template in `src/index.ts`.
   - Add it to the `CustomTemplatesFactory` and register it inside `getTemplatesConfig`.

## Contributing

To contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Add your custom template to the `/templates` folder.
4. Submit a pull request (PR) with a description of your template and its functionality.

Please ensure that your code follows the existing coding standards and includes necessary documentation.

## Folder Structure

Each custom template should be created inside the `/templates` directory. Every custom template folder should contain the following files:

1. **`index.tsx`**: The main React component file where the template logic and UI are defined.
2. **`image.png`**: An image that will serve as the background or thumbnail for the template.
3. Any other files required for the custom component (if needed).

## License

This project is open-source and available under the MIT License.
