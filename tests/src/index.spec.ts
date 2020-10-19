import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ParameterStoreSource from '../../src';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('ParameterStoreSource', () => {
  it('should expose library correctly', () => {
    expect(ParameterStoreSource, 'should be a function').to.be.a('function');
  });

  describe('invalid usage or setup', () => {
    it('@integration should error when invalid region is provided', async () => {
      const iniSource = new ParameterStoreSource('not-a-valid-region', {
        platform: 'specialCrm',
        compute: 'restApi',
        environment: 'dev',
      });
      await expect(iniSource.loadConfig()).to.be.rejectedWith(
        "Failed fetching parameters for region: not-a-valid-region & namespace: /_shared/_shared/_shared/. Error: UnknownEndpoint: Inaccessible host: `ssm.not-a-valid-region.amazonaws.com'. This service may not be available in the `not-a-valid-region' region.",
      );
    });

    it('should error when invalid region is provided', async () => {
      const iniSource = new ParameterStoreSource('not-a-valid-region', {
        platform: 'specialCrm',
        compute: 'restApi',
        environment: 'dev',
      });

      // Create a simple "mock" of expected result by overriding the getParams
      // instance.
      // eslint-disable-next-line func-names
      (iniSource as any).getParamsFromPath = function () {
        throw new Error(
          "Failed fetching parameters for region: not-a-valid-region & namespace: /_shared/_shared/_shared/. Error: UnknownEndpoint: Inaccessible host: `ssm.not-a-valid-region.amazonaws.com'. This service may not be available in the `not-a-valid-region' region.",
        );
      };
      await expect(iniSource.loadConfig()).to.be.rejectedWith(
        "Failed fetching parameters for region: not-a-valid-region & namespace: /_shared/_shared/_shared/. Error: UnknownEndpoint: Inaccessible host: `ssm.not-a-valid-region.amazonaws.com'. This service may not be available in the `not-a-valid-region' region.",
      );
    });
  });

  describe('loading from parameter store', () => {
    const expectedResult = {
      _shared: {
        _shared: {
          _shared: {
            testValue: '/_shared/_shared/_shared/testValue',
            company: {
              address: {
                city: 'Santa Cruz',
                line01: '115 Nice Road, Dr.',
                state: 'CA',
                zip: 95060,
              },
              name: 'The Big Company, Inc.',
            },
          },
          dev: {
            testValue: '/_shared/_shared/dev/testValue',
          },
        },
        restApi: {
          _shared: {
            testValue: '/_shared/restApi/_shared/testValue',
          },
          dev: {
            testValue: '/_shared/restApi/dev/testValue',
          },
        },
      },
      specialCrm: {
        _shared: {
          _shared: {
            testValue: '/specialCrm/_shared/_shared/testValue',
          },
          dev: {
            testValue: '/specialCrm/_shared/dev/testValue',
          },
        },
        restApi: {
          _shared: {
            testValue: '/specialCrm/restApi/_shared/testValue',
          },
          dev: {
            testValue: '/specialCrm/restApi/dev/testValue',
          },
        },
      },
    };

    it('@integration ishould read values specific to the environment', async () => {
      const parameterStoreSource = new ParameterStoreSource('us-west-1', {
        platform: 'specialCrm',
        compute: 'restApi',
        environment: 'dev',
      });

      const sourceType = await parameterStoreSource.loadConfig();
      expect(sourceType.description, 'should have correct description').to.contain(
        'parameter store',
      );
      expect(sourceType.data, 'should pull all expected values').to.deep.equal(expectedResult);
    });

    it('should read values specific to the environment', async () => {
      const parameterStoreSource = new ParameterStoreSource('us-west-1', {
        platform: 'specialCrm',
        compute: 'restApi',
        environment: 'dev',
      });

      // Create a simple "mock" of expected result by overriding the getParams
      // instance.
      // eslint-disable-next-line func-names
      (parameterStoreSource as any).getParams = function (param) {
        switch (param) {
          case '/_shared/_shared/_shared/':
            return {
              company: {
                address: {
                  city: 'Santa Cruz',
                  line01: '115 Nice Road, Dr.',
                  state: 'CA',
                  zip: 95060,
                },
                name: 'The Big Company, Inc.',
              },
              testValue: '/_shared/_shared/_shared/testValue',
            };
          case '/_shared/_shared/dev/':
            return { testValue: '/_shared/_shared/dev/testValue' };
          case '/_shared/restApi/_shared/':
            return { testValue: '/_shared/restApi/_shared/testValue' };
          case '/_shared/restApi/dev/':
            return { testValue: '/_shared/restApi/dev/testValue' };
          case '/specialCrm/_shared/_shared/':
            return { testValue: '/specialCrm/_shared/_shared/testValue' };
          case '/specialCrm/_shared/dev/':
            return { testValue: '/specialCrm/_shared/dev/testValue' };
          case '/specialCrm/restApi/_shared/':
            return { testValue: '/specialCrm/restApi/_shared/testValue' };
          case '/specialCrm/restApi/dev/':
            return { testValue: '/specialCrm/restApi/dev/testValue' };
          default:
            return {};
        }
      };

      const sourceType = await parameterStoreSource.loadConfig();
      expect(sourceType.description, 'should have correct description').to.contain(
        'parameter store',
      );
      expect(sourceType.data, 'should pull all expected values').to.deep.equal(expectedResult);
    });
  });
});
