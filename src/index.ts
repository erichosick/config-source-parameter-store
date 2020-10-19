import getParams from 'aws-parameters-store';
import merge from 'deepmerge';

import { IConfigContext, IConfigSource, ISourceType } from '@ehosick/config-core-types';

/**
 * ParameterStoreSource supports loading configuration and settings from SSM
 * parameter store based on the configuration context (see IConfigContext for
 * documentation). Note that, values not within the scope of the context will
 * not be pulled from parameter store. If context.environment = 'dev' then any
 * values in Parameter Store that are part of the 'stage' context will not be
 * pulled from parameter store.
 */
export default class ParameterStoreSource implements IConfigSource {
  #region: string;

  #context: IConfigContext;

  /**
   * Creates in instance of a ParameterStoreSource.
   * @param region The AWS region the parameters are located in.
   * @param context The current context of the configuration
   *                (see IConfigContext) for detailed documentation.
   */
  constructor(region: string, context: IConfigContext) {
    this.#region = region;
    this.#context = context;
  }

  /**
   * Making a call to getParameter returns the object at that level in
   * parameter store ignoring the initial key name. This "embeds" the
   * returned result in a complete object that contains the AWS Parameter Name
   * as an object hierarchy.
   * Example: /user/age = 45. getParam('/user/') will return { age: 45 }. This
   * function would return { user: { age: 45 } }.
   * @param namespace The AWS Parameter Name/Key.
   * @param obj The object we are "embedding" in the path.
   *
   * @returns An object that contains the Keyname Path as an object hierarchy
   *          with the object returned by getParam embedded.
   */
  private static addPath(namespace: string, obj: any): any {
    // Remove any / at the beginning or end of the path
    // These are required to query parameter store but not
    // required for building out the object.
    const finalPath = namespace.replace(/^\/+|\/+$/gm, '');
    const newData = {};
    let curData = newData;
    const properties = finalPath.split('/');
    properties.forEach((propName, index) => {
      curData[propName] = properties.length === index + 1 ? obj : {};
      curData = curData[propName];
    });
    return newData;
  }

  /**
   * Makes a call to SSM Parameter Store pulling all values located within
   * the namespace.
   * @param namespace The AWS Parameter Name/Key.
   *
   * @returns An json object representation of all Parameter Names/Values
   *          located under the namespace.
   */
  /* NOTE: Integration tests cover making an actual call to AWS.
           So, for mocked testing, we are ignoring this function.
  */
  /* istanbul ignore next */
  private async getParams(namespace: string): Promise<any> {
    const result = await getParams(namespace, {
      region: this.#region,
      recursive: true,
      withDecryption: true,
    });
    return result;
  }

  /**
   * Makes a call to SSM Parameter Store pulling all values located within
   * the namespace and then "embedding" that object within in the namespace.
   * See addPath for deailed documentation on why this is necessary.
   * @param namespace The AWS Parameter Name/Key.
   *
   * @returns An object that contains the Keyname Path as an object hierarchy
   *          with the object returned by getParam embedded.
   */
  private async getParamsFromPath(namespace: string): Promise<any> {
    const params = await this.getParams(namespace);
    return ParameterStoreSource.addPath(namespace, params);
  }

  /**
   * Asynchronously loads the configuration and settings from AWS Parameter
   * Store and and converts it to json.
   *
   * @Returns Return, upon promise resolution (await), an ISourceType containing
   * the configuration data.
   */
  public async loadConfig(): Promise<ISourceType> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ISourceType>(async (resolve, reject) => {
      let params = {};
      try {
        // NOTE: Be careful not to make too many call to paramter store or
        //       we got throttled. As such, let's call this serially instead
        //       of in parallel.
        params = merge(
          await this.getParamsFromPath('/_shared/_shared/_shared/'),
          await this.getParamsFromPath(`/_shared/_shared/${this.#context.environment}/`),
        );
        params = merge(
          params,
          await this.getParamsFromPath(`/_shared/${this.#context.compute}/_shared/`),
        );
        params = merge(
          params,
          await this.getParamsFromPath(
            `/_shared/${this.#context.compute}/${this.#context.environment}/`,
          ),
        );
        params = merge(
          params,
          await this.getParamsFromPath(`/${this.#context.platform}/_shared/_shared/`),
        );
        params = merge(
          params,
          await this.getParamsFromPath(
            `/${this.#context.platform}/_shared/${this.#context.environment}/`,
          ),
        );
        params = merge(
          params,
          await this.getParamsFromPath(
            `/${this.#context.platform}/${this.#context.compute}/_shared/`,
          ),
        );
        params = merge(
          params,
          await this.getParamsFromPath(
            `/${this.#context.platform}/${this.#context.compute}/${this.#context.environment}/`,
          ),
        );
      } catch (exception) {
        reject(exception);
      }

      resolve({
        description: 'parameter store',
        data: params,
      });
    });
  }
}
