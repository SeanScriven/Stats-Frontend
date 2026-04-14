import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const [name, location, styleType = 'scss'] = process.argv.slice(2);

if (!name || !location) {
  console.error('Usage: node scripts/generate-component.js <ComponentName> <location> <scss|styled>');
  console.error('Example: node scripts/generate-component.js Leagues src/pages scss');
  console.error('Example: node scripts/generate-component.js Button src/components styled');
  process.exit(1);
}

if (!['scss', 'styled'].includes(styleType)) {
  console.error('Style type must be either scss or styled');
  process.exit(1);
}

const dir = join(process.cwd(), location, name);

if (existsSync(dir)) {
  console.error(`Directory already exists: ${dir}`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const getComponentContent = () => {
  if (styleType === 'styled') {
    return `import { Container } from './${name}.styles';

interface ${name}Props {}

function ${name}({}: ${name}Props) {
  return (
    <Container>
      <h1>${name}</h1>
    </Container>
  );
}

export default ${name};
`;
  }

  return `import styles from './${name}.module.scss';

interface ${name}Props {}

function ${name}({}: ${name}Props) {
  return (
    <div className={styles.container}>
      <h1>${name}</h1>
    </div>
  );
}

export default ${name};
`;
};

const getStyleContent = () => {
  if (styleType === 'styled') {
    return `import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));
`;
  }

  return `.container {
  display: flex;
  flex-direction: column;
}
`;
};

const getStyleFilename = () => {
  return styleType === 'styled' ? `${name}.styles.ts` : `${name}.module.scss`;
};

const files = {
  [`${name}.tsx`]: getComponentContent(),

  [getStyleFilename()]: getStyleContent(),

  [`${name}.lazy.tsx`]: `import { lazy } from 'react';

const ${name} = lazy(() => import('./${name}'));

export default ${name};
`,

  [`${name}.test.tsx`]: `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});
`,

  ['index.ts']: `export { default } from './${name}';
`,
};

for (const [filename, content] of Object.entries(files)) {
  writeFileSync(join(dir, filename), content);
  console.log(`  Created: ${location}/${name}/${filename}`);
}

console.log(`\nComponent ${name} created at ${location}/${name}/ using ${styleType} styles`);