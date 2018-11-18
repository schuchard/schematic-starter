import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic
} from "@angular-devkit/schematics";

const licenseText = (name: string) => `
/**
 * @license
 * Copyright ${name} Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
`;

export function schematicStarter(options: any): Rule {
  return chain([
    externalSchematic("@schematics/angular", "component", options),
    (tree: Tree, _context: SchematicContext) => {
      tree.getDir("./src/app").visit(filePath => {
        if (!filePath.endsWith(".ts")) {
          return;
        }

        const content = tree.read(filePath);
        if (!content) {
          return;
        }

        // Prevent from writing license to files that already have one.
        const license = licenseText(options.name);
        if (content.indexOf(license) == -1) {
          tree.overwrite(filePath, license + content);
        }
      });
      return tree;
    }
  ]);
}
