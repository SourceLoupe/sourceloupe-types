import { ScanRule } from './scan-rule.js';
import * as fs from 'node:fs';
import { JSONObject } from './json-object.js';

/**
 * This class defines the interface for a SourceLoupe plugin. Currently this supports two types of information:
 *
 * 1. The package name of the plugin - This is provided by us - Sourceloupe maintainers - and is used to surface
 * the plugin's pacakge name to the SourceLoupe CLI and Engine. It uses the package.json file of the plugin and
 * reads the name field to get the package name. *** Note: Developers creating plugins do not need to implement
 * this function, as the abstract class below contains the method used to grab the package name.
 *
 * 2. The rules that the plugin provides - This is provided by the plugin developer and is used to surface the rules.
 * The rules are defined in the plugin and are returned by the getRules method. As a reminder, the CLI is responsible
 * for filtering included rules.
 *
 * Here's how you can implement this class:
 * ```typescript
 * export default class MyRules extends SourceLoupePlugin {
 *     getRules(): ScanRule[] {
 *         (...) // Your rules here
 *     }
 * }
 * ```
 *
 * Notes:
 *  1. You must export your class as default for the plugin loader to work.
 *
 */
export abstract class SourceLoupePlugin {
    /**
     * This method is used to get the package name of the plugin. It reads the package.json file of the plugin
     * @returns {string}
     */
    getPackageId(): string {
        try {
            const packagePath: string = require.resolve('./package.json');
            const packageDef: JSONObject = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as JSONObject;
            return packageDef.name as string;
        } catch (error) {
            console.error('Could not read package.json. Do you have permissions to read it? Is it present?:', error);
            return 'invalid';
        }
    }

    /**
     * This method is used to get the rules that the plugin provides.
     * The rules are defined in the plugin and are returned by this method that plugin developers must implement.
     * @returns {ScanRule[]}
     */
    abstract getRules(): ScanRule[];
}
