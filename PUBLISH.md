# Publishing Guide

## Prerequisites

1. **NPM Account**: Make sure you're logged in as `avenbreaks`
   ```bash
   npm login
   # Username: avenbreaks
   # Password: [your password]
   # Email: [your email]
   ```

2. **Verify Login**:
   ```bash
   npm whoami
   # Should output: avenbreaks
   ```

## Pre-Publish Checklist

- [ ] Update version in `package.json` (follow semver)
- [ ] Update `CHANGELOG.md` with changes
- [ ] Run tests: `npm test` (if available)
- [ ] Build the package: `npm run build`
- [ ] Check build output in `dist/` folder
- [ ] Verify package contents: `npm pack --dry-run`

## Publishing Steps

### 1. Build the Package

```bash
cd resonance-sdk/sdk
npm install
npm run build
```

### 2. Test Locally (Optional)

```bash
# Create a tarball
npm pack

# This creates: avenbreaks-resonance-sdk-0.1.1.tgz
# Test in another project:
# npm install /path/to/avenbreaks-resonance-sdk-0.1.1.tgz
```

### 3. Publish to NPM

```bash
# Dry run first (see what will be published)
npm publish --dry-run

# If everything looks good, publish
npm publish
```

### 4. Verify Publication

```bash
# Check on npm
npm view @avenbreaks/resonance-sdk

# Or visit: https://www.npmjs.com/package/@avenbreaks/resonance-sdk
```

## Version Management

Follow semantic versioning (semver):

- **Patch** (0.1.1 → 0.1.2): Bug fixes
  ```bash
  npm version patch
  npm publish
  ```

- **Minor** (0.1.1 → 0.2.0): New features (backward compatible)
  ```bash
  npm version minor
  npm publish
  ```

- **Major** (0.1.1 → 1.0.0): Breaking changes
  ```bash
  npm version major
  npm publish
  ```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
        working-directory: resonance-sdk/sdk
      
      - name: Build
        run: npm run build
        working-directory: resonance-sdk/sdk
      
      - name: Publish to NPM
        run: npm publish
        working-directory: resonance-sdk/sdk
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### "You must be logged in to publish packages"
```bash
npm login
```

### "You do not have permission to publish"
Make sure you're logged in as `avenbreaks` and the package name is available.

### "Package name too similar to existing package"
The name `@avenbreaks/resonance-sdk` should be unique under your scope.

### "Version already exists"
Bump the version number in `package.json` before publishing.

## Unpublishing (Use with Caution)

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish @avenbreaks/resonance-sdk@0.1.1

# Unpublish entire package (within 72 hours, use carefully!)
npm unpublish @avenbreaks/resonance-sdk --force
```

## Post-Publish

1. Update frontend to use the published package:
   ```bash
   cd resonance-frontend
   npm install @avenbreaks/resonance-sdk@latest
   ```

2. Update documentation with installation instructions

3. Create a GitHub release with changelog

4. Announce on social media/community channels
