import { PedidoItem } from 'src/interfaces/PedidoItem';
import { Pedido } from 'src/interfaces/Pedido';
import { Lote } from 'src/interfaces/Lote';

function geraHtml(lote: Lote, descStatus: string, total: number, listaPedidosString: string, 
    listaProdutos: PedidoItem[]): string {
  let tabela: string;
  let produtos = '';
  listaProdutos.forEach(v => {
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
          <title>Lote ${lote.id}</title>
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
          <b>Lote:</b> ${lote.id} <br>
          <b>Status:</b> ${lote.status_id} - ${descStatus} <br>
          <b>Data:</b> ${lote.dt_lote} <br>
          <b>Total:</b> ${total.toFixed(2).replace('.',',')} <br>
          <b>Pedidos:</b> ${listaPedidosString} <br><br>
          <b>Produtos:</b><br>
              <span> ${tabela} </span>
      </body>
      </html>
  `;
  return htmlContent;
}
    

export default geraHtml;
  