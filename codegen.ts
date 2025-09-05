import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  documents: ['src/**/*.{ts,tsx,graphql,gql}', '!src/types/generated.ts'],
  generates: {
    'src/types/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        apolloReactHooksImportFrom: '@apollo/client',
        apolloReactCommonImportFrom: '@apollo/client',
        namingConvention: {
          typeNames: 'pascal-case#pascalCase',
          enumValues: 'upper-case#upperCase',
        },
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, any>',
        },
        skipTypename: false,
        withRefetchFn: true,
        dedupeOperationSuffix: true,
        omitOperationSuffix: false,
        exportFragmentSpreadSubTypes: true,
        documentMode: 'string',
        strictScalars: true,
        defaultScalarType: 'unknown',
      },
    },
    'src/types/graphql-schema.json': {
      plugins: ['introspection'],
      config: {
        minify: true,
      },
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier --write'],
  },
};

export default config;
