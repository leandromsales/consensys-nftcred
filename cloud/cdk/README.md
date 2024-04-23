# Deploy NFTCred in AWS

This project uses AWS CDK to deploy all the infra in AWS cloud. The infra deploy services inim

- services/api: implementation of the api.nftcred.io developed in Nestjs (backend)
- services/app: implementation of the app.nftcred.io developed in Nextjs (frontend)

# Setup

- Install AWS CDK

```console
npm install -g aws-cdk
```

- Install dependences

```console
npm install
```

- It is necessary to have an AWS account with the necessary permissions configured in the AWS CLI under the profile name "nftcred".

## Helper commands

### Perform the Synth of the Stacks (Code and resource verification process)

```console
npm run sync
```

### List the Stages of the Stack

```console
npm run list
```

### Run the diff on a Stage of the Stack

```console
npm run diff:<stack-name>
```

### Run the diff on all Stages of the Stack

```console
npm run diff
```

```console
npm run deploy:<nome-da-Stack>
```

```console
npm run deploy
```

### Destroy the development Stack (There is no script to destroy the production Stack)

```console
npm run destroy
```
