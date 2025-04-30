# FootballWork FC - Mobile

## Sobre o Projeto

O **FootballWork** FC é um aplicativo para organização de partidas de futebol amador, permitindo o sorteio equilibrado de times, gerenciamento de jogadores e acompanhamento do histórico de partidas.

**Funcionalidades**

**Gerenciamento de Jogadores:** Cadastre jogadores com nome, nível de habilidade e posição.
**Sorteio de Times:** Gere times equilibrados automaticamente com base no nível de habilidade dos jogadores.
**Visualização em Campo:** Posicione os jogadores em um campo virtual e mova-os conforme necessário.
**Cartões:** Atribua cartões amarelos e vermelhos aos jogadores.
**Histórico de Partidas:** Salve e consulte partidas anteriores.
**Interface Responsiva:** Funciona em dispositivos móveis e desktop.

## Tecnologias Utilizadas

React
TypeScript
Tailwind CSS
Capacitor (para compilação nativa)
date-fns (formatação de datas)
Lucide React (ícones)

## Instalação e Execução

**Pré-requisitos**
Node.js (versão 14 ou superior)
npm ou yarn
Android Studio (para compilação Android)

## Instalação

**Clone o repositório:**
git clone https://github.com/Solonjaber/craque-sorteio-mobile.git
cd craque-sorteio-mobile

**Instale as dependências:**
npm install

**Execução em Desenvolvimento**

Para executar o aplicativo em modo de desenvolvimento:

npm run dev

**Compilação para Web**

Para compilar o aplicativo para web:

npm run build

**Compilação para Android**

1. Instale o Capacitor:

npm install @capacitor/cli @capacitor/core

2. Adicione a plataforma Android:

npx cap add android

3. Compile o projeto web:

npm run build

4. Sincronize os arquivos com a plataforma Android:

npx cap sync

5. Abra o projeto no Android Studio:

npx cap open android

No Android Studio, você pode executar o aplicativo em um emulador ou gerar um APK para instalação.
Estrutura do Projeto
/src/components: Componentes reutilizáveis da interface
/src/pages: Páginas principais do aplicativo
/src/store: Gerenciamento de estado (jogadores e partidas)
/src/types: Definições de tipos TypeScript
/src/utils: Funções utilitárias, incluindo o algoritmo de sorteio de times
/src/hooks: Hooks personalizados

**Como Usar**

Cadastro de Jogadores: Na tela inicial, adicione os jogadores que participarão da partida.
Geração de Times: Na tela "Gerar Times", selecione o número de jogadores por time e clique em "Sortear Times".
Visualização em Campo: Alterne para a visualização de campo para posicionar os jogadores.
Gerenciamento de Cartões: Clique duas vezes em um jogador no campo para atribuir cartões.
Salvar Partida: Após gerar os times, você pode salvar a partida no histórico.
Consultar Histórico: Na tela "Histórico", você pode ver partidas anteriores e reutilizar times.

**Contribuição**
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

**Licença**

Este projeto está licenciado sob a licença MIT.

### Desenvolvido por Solonjaber