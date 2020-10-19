# config-source-parameter-store

[![GitHub license](https://img.shields.io/github/license/erichosick/config-source-parameter-store?style=flat)](https://github.com/erichosick/config-source-parameter-store/blob/main/LICENSE) ![npm](https://img.shields.io/npm/v/@ehosick/config-source-parameter-store) [![codecov](https://codecov.io/gh/erichosick/config-source-parameter-store/branch/main/graph/badge.svg)](https://codecov.io/gh/erichosick/config-source-parameter-store)

[config-core](https://github.com/erichosick/config-core) extension which loads configuration, and settings from AWS SSM Parameter Store.

## Authentication with AWS

In AWS, compute instances assume roles meaning there is no need to setup environment variables that are required for local development: specifically `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc. If there was a way for development systems to mimic a computer instance in AWS and "assume" a role then any services ran on the development system could then just assume that role.

There is just such a tool by 99 Designs called [AWS Vault](https://github.com/99designs/aws-vault). Once you've setup AWS vault, and created an identity you can run AWS vault as a service:

```bash
# aws-vault exec ${profile} --server
$ aws-vault exec developer --server
# You should then be able to run the following command
$ aws ssm get-parameters-by-path --path '/' --recursive
```

## Testing

### Integration Tests

To run integration tests, you:

- will need to have an AWS user or role with access to SSM. Example policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "ssm:PutParameter",
        "ssm:LabelParameterVersion",
        "ssm:DeleteParameter",
        "ssm:GetParameterHistory",
        "ssm:AddTagsToResource",
        "ssm:DescribeDocumentParameters",
        "ssm:GetParametersByPath",
        "ssm:GetParameters",
        "ssm:GetParameter",
        "ssm:DeleteParameters"
      ],
      "Resource": "arn:aws:ssm:*:668189822632:parameter/*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": "ssm:DescribeParameters",
      "Resource": "*"
    }
  ]
}
```

- should use something like `aws-vault` and run it as a service.

```bash
$ aws-vault exec developer --server
```

- then run the following shell script located in `tests/src/integration-scripts`.
