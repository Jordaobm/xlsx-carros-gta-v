<div align="center">
  <img alt="adder" title="adder" src="https://github.com/Jordaobm/xlsx-carros-gta-v/blob/master/images/Adder.png" width="300px" />
  <img alt="entityxf" title="entityxf" src="https://github.com/Jordaobm/xlsx-carros-gta-v/blob/master/images/Entity%20XF.png" width="300px" />
  <img alt="zentorno" title="zentorno" src="https://github.com/Jordaobm/xlsx-carros-gta-v/blob/master/images/Zentorno.png" width="300px" />
</div>


# Coletor de Dados de Carros do GTA V

## Sumário
1. [Sobre a Aplicação](#sobre-a-aplicação)
2. [Guia para Executar a Aplicação](#guia-para-executar-a-aplicação)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Considerações Finais](#considerações-finais)

## Sobre a Aplicação
A aplicação é uma poderosa ferramenta que automatiza a coleta e organização de informações sobre carros presentes no jogo Grand Theft Auto V (GTA V). Ela é projetada para simplificar o processo de reunir dados detalhados sobre os veículos disponíveis no jogo, fornecendo aos entusiastas e jogadores uma maneira eficiente de acessar informações valiosas.

**Principais Recursos:**

- **Captura de Dados**: A aplicação extrai os dados de uma lista de carros contidos em um arquivo Excel. Essa lista inclui informações como o nome do carro e a garagem onde ele está armazenado no jogo.

- **Pesquisa Web Inteligente**: Utilizando a tecnologia Puppeteer, a aplicação realiza buscas detalhadas sobre cada carro em um site especializado, recuperando informações adicionais, como categoria, capacidade e uma imagem representativa do veículo.

- **Criação de Nova Planilha**: Com os dados coletados, a aplicação gera automaticamente uma nova planilha Excel, estruturada de forma organizada e legível, incluindo as informações adicionais obtidas durante a pesquisa na web.

- **Facilidade de Uso**: O processo de execução da aplicação é simplificado e guiado, permitindo que qualquer usuário, mesmo com pouca experiência técnica, possa coletar dados com facilidade.

## Guia para Executar a Aplicação
Para utilizar a aplicação, siga as instruções abaixo:

1. **Instalação do Node.js**: Certifique-se de que o Node.js está instalado em sua máquina. Caso contrário, você pode baixá-lo em [nodejs.org](https://nodejs.org/).

2. **Instalação de Dependências**: Abra o terminal e navegue até o diretório do projeto. Execute o comando `npm install` para instalar todas as dependências necessárias.

3. **Preparação da Planilha**: Antes de executar a aplicação, crie um arquivo Excel contendo informações sobre os carros do GTA V, seguindo o modelo fornecido.

4. **Salve a Planilha**: Salve a planilha criada na etapa anterior dentro da pasta `/xlsx`, nomeando-a como `1.xlsx`.

5. **Execução da Aplicação**: No terminal, execute o comando `npm run execute` para iniciar a aplicação. A aplicação começará a coletar e organizar os dados automaticamente.

## Tecnologias Utilizadas
A aplicação faz uso das seguintes tecnologias e bibliotecas:

- **axios**: Utilizado para efetuar o download de imagens dos carros a partir da web.
- **exceljs**: Empregado para a manipulação de planilhas Excel, possibilitando a criação da nova planilha com os dados coletados.
- **fs**: Responsável pela leitura e persistência de arquivos necessários durante o processo.
- **puppeteer**: Utilizado para conduzir buscas detalhadas sobre cada carro em páginas web, coletando informações precisas.

## Considerações Finais
Esta aplicação nasceu da minha necessidade pessoal de organizar os carros no jogo GTA V. Com uma grande variedade de veículos à disposição, é fácil perder o controle. A aplicação simplifica o processo, fornecendo informações detalhadas e imagens dos carros, tornando mais fácil lembrar de todos eles apenas pelo nome. Espero que ela seja útil para você também.
