import { Pedido } from 'src/interfaces/Pedido';

function geraHtml(pedido: Pedido, descStatus: string, total: number): string {
  let tabela: string;
  let produtos = '';
  pedido.itens.forEach(v => {
    produtos = produtos +
      '<tr><td>&nbsp;' + v.qtd + '&nbsp;</td><td>&nbsp;' 
      + v.nome + ' ' + v.sabor + ' ' + v.peso + '&nbsp;</td><td>&nbsp;' +
      'R$ ' + (v.qtd * (v.qtd_embalagem * v.preco_unidade)).toFixed(2).replace('.',',') + '&nbsp;</td></tr>'
  });

  tabela = `
      <table>
        <tbody> ` + 
          produtos +
      `  </tbody>
      </table>
  `  
  //const htmlTable = `  
  //
  //`;
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pedido ${pedido.id}</title>
          <style>
              body {
                  font-size: 40px;
                  /*color: rgb(255, 196, 0);*/
              }
              h1 {
                  text-align: left;
              }
              span {
                  font-size: 30px;
              }
              table {
                  border-collapse: collapse;
              }
              table, th, td {
                  border: 1px solid black;
              }
              .texto {
                  font-size: 40px;
              }
          </style>
      </head>
      <body class="texto">
          <b>Pedido:</b> ${pedido.id} <br>
          <b>Status:</b> ${pedido.status_id} - ${descStatus} <br>
          <b>Cliente:</b> ${pedido.nomeCliente} <br>
          <b>Vendedor:</b> ${pedido.nomeVendedor} <br>
          <b>Data:</b> ${pedido.dt_pedido} <br>
          <b>Total:</b> ${total.toFixed(2).replace('.',',')} <br><br>
          <b>Produtos:</b><br>
              <span> ${tabela} </span>
      </body>
      </html>
  `;
  return htmlContent;
}
    

export default geraHtml;
  