import type { NodePlopAPI } from 'plop'

export default function (plop: NodePlopAPI): void {
  plop.setGenerator('feature', {
    description: 'Create a new feature module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature name (e.g. player):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/feature/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/model/index.ts',
        templateFile: 'plop-templates/feature/model/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/model/{{kebabCase name}}-store.ts',
        templateFile: 'plop-templates/feature/model/store.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/model/{{kebabCase name}}-store-selectors.ts',
        templateFile: 'plop-templates/feature/model/store-selectors.ts.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/ui/{{kebabCase name}}/index.tsx',
        templateFile: 'plop-templates/feature/ui/component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{kebabCase name}}/use-case/run-{{kebabCase name}}-check.ts',
        templateFile: 'plop-templates/feature/use-case/run-check.ts.hbs',
      },
    ],
  })
}
