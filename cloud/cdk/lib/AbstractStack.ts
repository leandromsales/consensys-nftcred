import { Construct } from "constructs";
import { Stack } from "aws-cdk-lib";
import { ApplicationProps } from "./TypesOptions";

export abstract class AbstractStack extends Stack {

    protected props: ApplicationProps;

    constructor(scope: Construct, id: string, props: ApplicationProps) {
        super(scope, id, props.stack);
        this.props = props;
    }

}