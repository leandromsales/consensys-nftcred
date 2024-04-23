import { Construct } from "constructs";
import { ApplicationProps, StagesConfigType } from "./TypesOptions";

export abstract class AbstractService extends Construct {
  protected props: ApplicationProps;
  protected stageName: string;
  protected stageNameKey: StagesConfigType;

  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props: ApplicationProps,
  ) {
    super(scope, id);
    this.props = props;
    this.stageName = stageName;
    this.stageNameKey = this.stageName as StagesConfigType;
  }

  defineLogicalId(name: string) {
    return ApplicationProps.defineLogicalId(name, this.stageName);
  }

  definePhysicalName(stackName: string, name: string) {
    return ApplicationProps.definePhysicalName(name, stackName);
  }

  getStage() {
    return this.props.stages.get(this.stageName)!;
  }
}
