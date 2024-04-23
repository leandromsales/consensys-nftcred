import { Construct } from "constructs";
import {
  Certificate,
  CertificateValidation,
  DnsValidatedCertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { AbstractService } from "../AbstractService";
import { ApplicationProps } from "../TypesOptions";

export class ACMService extends AbstractService {
  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props: ApplicationProps,
  ) {
    super(scope, id, stageName, props);

    this._getUsEastCertificate();
    this._getRegionalCertificate();
  }

  _getUsEastCertificate() {
    const resId = this.defineLogicalId(`ACM-Us-East-Cert-${this.stageName}`);
    this.props.usEastCertificate = new DnsValidatedCertificate(this, resId, {
      domainName: `*.${this.props.fullDomain}`,
      hostedZone: this.props.zone,
      region: "us-east-1", // must be us-east-1 for cloudfront distributions.
    });
    return this.props.usEastCertificate;
  }

  _getRegionalCertificate() {
    const resId = this.defineLogicalId(`ACM-Regional-Cert-${this.stageName}`);
    this.props.regionalCertificate = new Certificate(this, resId, {
      domainName: `*.${this.props.fullDomain}`,
      validation: CertificateValidation.fromDns(this.props.zone),
    });

    return this.props.regionalCertificate;
  }
}
