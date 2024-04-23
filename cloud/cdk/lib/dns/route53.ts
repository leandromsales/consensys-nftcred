import { Construct } from "constructs";
import { HostedZone, NsRecord } from "aws-cdk-lib/aws-route53";
import { ApplicationProps } from "../TypesOptions";
import { AbstractService } from "../AbstractService";

export class Route53Service extends AbstractService {
  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props: ApplicationProps,
  ) {
    super(scope, id, stageName, props);

    this.props.zone = HostedZone.fromLookup(
      this,
      this.defineLogicalId("BaseZone"),
      {
        domainName: this.props.domain,
      },
    );
  }
}
