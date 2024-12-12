import fs from 'fs';
import path from 'path';
import { generateAllScenarios } from '../data/scenarios/scenarioGenerator';
import { mainCategories } from '../data/scenarios/scenarioCategories';

const OUTPUT_DIR = path.join(__dirname, '../data/generated');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate scenarios for each category
console.log('Starting scenario generation...');
console.time('Scenario Generation');

const allScenarios = generateAllScenarios();
let totalScenarios = 0;

// Save scenarios by category
mainCategories.forEach(category => {
  const scenarios = allScenarios[category];
  totalScenarios += scenarios.length;
  
  // Save to JSON file
  const filePath = path.join(OUTPUT_DIR, `${category}_scenarios.json`);
  fs.writeFileSync(filePath, JSON.stringify(scenarios, null, 2));
  
  console.log(`Generated ${scenarios.length} scenarios for ${category}`);
});

console.timeEnd('Scenario Generation');
console.log(`Total scenarios generated: ${totalScenarios}`);

// Generate index file
const indexData = mainCategories.reduce((acc, category) => {
  acc[category] = {
    count: allScenarios[category].length,
    file: `${category}_scenarios.json`
  };
  return acc;
}, {});

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'index.json'),
  JSON.stringify(indexData, null, 2)
);

// Generate statistics
const statistics = {
  totalScenarios,
  categoryCounts: indexData,
  generatedAt: new Date().toISOString(),
  difficultyDistribution: {
    beginner: 0,
    intermediate: 0,
    advanced: 0
  }
};

// Calculate difficulty distribution
mainCategories.forEach(category => {
  allScenarios[category].forEach(scenario => {
    statistics.difficultyDistribution[scenario.difficulty]++;
  });
});

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'statistics.json'),
  JSON.stringify(statistics, null, 2)
);

// Generate README for the generated data
const readmeContent = `# Generated Scenarios

This directory contains automatically generated scenarios for the English Learning Application.

## Statistics

- Total Scenarios: ${totalScenarios}
- Generated on: ${statistics.generatedAt}

## Difficulty Distribution

- Beginner: ${statistics.difficultyDistribution.beginner} scenarios
- Intermediate: ${statistics.difficultyDistribution.intermediate} scenarios
- Advanced: ${statistics.difficultyDistribution.advanced} scenarios

## Categories

${mainCategories.map(category => `
### ${category.charAt(0).toUpperCase() + category.slice(1)}
- Scenarios: ${statistics.categoryCounts[category].count}
- File: ${statistics.categoryCounts[category].file}
`).join('\n')}

## File Structure

- \`index.json\`: Contains metadata about all generated scenarios
- \`statistics.json\`: Contains detailed statistics about the generated scenarios
- \`{category}_scenarios.json\`: Contains scenarios for each category

## Usage

To use these scenarios in your application:

\`\`\`javascript
import scenarios from './generated/index.json';

// Load scenarios for a specific category
const categoryScenarios = require(\`./generated/\${category}_scenarios.json\`);
\`\`\`

## Regeneration

To regenerate these scenarios, run:

\`\`\`bash
npm run generate-scenarios
\`\`\`

Note: Each generation will create unique scenarios with different combinations of
dialogues, vocabulary, and cultural notes.
`;

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'README.md'),
  readmeContent
);

// Create a validation script
const validationScript = `
import fs from 'fs';
import path from 'path';

const validateScenarios = () => {
  const indexPath = path.join(__dirname, 'index.json');
  const index = JSON.parse(fs.readFileSync(indexPath));
  
  let isValid = true;
  
  Object.entries(index).forEach(([category, info]) => {
    const filePath = path.join(__dirname, info.file);
    
    if (!fs.existsSync(filePath)) {
      console.error(\`Missing file: \${info.file}\`);
      isValid = false;
      return;
    }
    
    const scenarios = JSON.parse(fs.readFileSync(filePath));
    
    if (scenarios.length !== info.count) {
      console.error(\`Count mismatch for \${category}: expected \${info.count}, got \${scenarios.length}\`);
      isValid = false;
    }
    
    scenarios.forEach((scenario, index) => {
      if (!scenario.id || !scenario.title || !scenario.difficulty) {
        console.error(\`Invalid scenario in \${category} at index \${index}\`);
        isValid = false;
      }
    });
  });
  
  return isValid;
};

export { validateScenarios };
`;

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'validateScenarios.js'),
  validationScript
);

// Add npm script to package.json if it doesn't exist
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

if (!packageJson.scripts['generate-scenarios']) {
  packageJson.scripts['generate-scenarios'] = 'node src/scripts/generateScenarios.js';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

console.log('\nScenario generation complete!');
console.log(`Files generated in: ${OUTPUT_DIR}`);
console.log('Run npm run generate-scenarios to regenerate scenarios'); 