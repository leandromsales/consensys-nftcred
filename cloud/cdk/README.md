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

- É necessário possuir uma conta AWS com permissões necessárias configurada na AWS CLI com o nome de perfil "htm-edge". Mais detalhes no guia de operação.

## Scripts auxiliares

### Realizar o Synth das Stacks (Processo de verificação do código e recursos)

```console
npm run sync
```

### Listar os Stages da Stack

```console
npm run list
```

### Rodar o diff em um Stage da Stack

```console
npm run diff:<nome-da-Stack>
```

### Rodar o diff em todos os Stages da Stack

```console
npm run diff
```

### Realizar o deploy de Stage da Stack

```console
npm run build-dashboard
```

```console
npm run deploy:<nome-da-Stack>
```

### Realizar o deploy de todos os Stages da Stack

```console
npm run build-dashboard
```

```console
npm run deploy
```

### Destruir a Stack de desenvolvimento (Não existe script para destruir a Stack de produção)

```console
npm run destroy
```
