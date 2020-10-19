# Create test data in AWS Parameter Store for integration tests

aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/company/name",             "Value": "The Big Company, Inc."                  }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/company/address/line01",   "Value": "115 Nice Road, Dr."                     }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/company/address/city",     "Value": "Santa Cruz"                             }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/company/address/state",    "Value": "CA"                                     }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/company/address/zip",      "Value": "95060"                                  }' &

aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/testValue",                "Value": "/_shared/_shared/_shared/testValue"     }' &                               
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/dev/testValue",                    "Value": "/_shared/_shared/dev/testValue"         }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/restApi/_shared/testValue",                "Value": "/_shared/restApi/_shared/testValue"     }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/restApi/dev/testValue",                    "Value": "/_shared/restApi/dev/testValue"         }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/specialCrm/_shared/_shared/testValue",             "Value": "/specialCrm/_shared/_shared/testValue"  }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/specialCrm/_shared/dev/testValue",                 "Value": "/specialCrm/_shared/dev/testValue"      }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/specialCrm/restApi/_shared/testValue",             "Value": "/specialCrm/restApi/_shared/testValue"  }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/specialCrm/restApi/dev/testValue",                 "Value": "/specialCrm/restApi/dev/testValue"      }' &

# Shoud not return during test
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/_shared/testValue",                "Value": "/_shared/_shared/_shared/testValue"     }' &                               
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/_shared/stage/testValue",                  "Value": "/_shared/_shared/stage/testValue"       }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/anotherApi/_shared/testValue",             "Value": "/_shared/anotherApi/_shared/testValue"  }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/_shared/anotherApi/stage/testValue",               "Value": "/_shared/anotherApi/stage/testValue"    }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/otherCrm/_shared/_shared/testValue",               "Value": "/otherCrm/_shared/_shared/testValue"    }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/otherCrm/_shared/stage/testValue",                 "Value": "/otherCrm/_shared/stage/testValue"      }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/otherCrm/anotherApi/_shared/testValue",            "Value": "/otherCrm/anotherApi/_shared/testValue" }' &
aws ssm put-parameter --region us-west-1 --overwrite --cli-input-json '{"Type": "String", "Name": "/otherCrm/anotherApi/stage/testValue",              "Value": "/otherCrm/anotherApi/stage/testValue"   }'
