import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as xml2js from 'xml2js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  produtos: any[] = [];
  totalValor: number = 0;
  totalICMS: number = 0;
  totalIPI: number = 0;
  totalPIS: number = 0;
  totalCOFINS: number = 0;
  totalNota: number = 0;

  // Valores totais da nota fiscal
  totalNotaFiscal: number = 0;
  totalICMSNota: number = 0;
  totalIPINota: number = 0;
  totalPISNota: number = 0;
  totalCOFINSNota: number = 0;

  // Diferença entre total com impostos e total da nota
  diferencaTotal: number = 0;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const xmlString = e.target.result;

        const parser = new xml2js.Parser();
        parser.parseString(xmlString, (err, result) => {
          if (err) {
            console.error('Erro ao processar o XML', err);
            return;
          }

          this.processarDados(result);
        });
      };

      reader.readAsText(file);
    }
  }

  processarDados(xmlJson: any) {
    this.produtos = [];
    this.totalValor = 0;
    this.totalICMS = 0;
    this.totalIPI = 0;
    this.totalPIS = 0;
    this.totalCOFINS = 0;
    this.totalNota = 0;
  
    const produtos = xmlJson.nfeProc.NFe[0].infNFe[0].det;
  
    produtos.forEach((produto: any) => {
      const nomeProduto = produto.prod[0].xProd[0];
      const valorProduto = parseFloat(produto.prod[0].vProd[0]);
  
      // Inicialize valores de impostos como 0
      let valorICMS = 0;
      let valorIPI = 0;
      let valorPIS = 0;
      let valorCOFINS = 0;
  
      // ICMS
      if (produto.imposto[0].ICMS[0].ICMS00) {
        const icms = produto.imposto[0].ICMS[0].ICMS00[0];
        valorICMS = parseFloat(icms.vICMS[0]);
      }
  
      // IPI
      if (produto.imposto[0].IPI[0].IPITrib) {
        const ipi = produto.imposto[0].IPI[0].IPITrib[0];
        valorIPI = parseFloat(ipi.vIPI[0]);
      }
  
      // PIS
      if (produto.imposto[0].PIS[0].PISAliq) {
        const pis = produto.imposto[0].PIS[0].PISAliq[0];
        valorPIS = parseFloat(pis.vPIS[0]);
      }
  
      // COFINS
      if (produto.imposto[0].COFINS[0].COFINSAliq) {
        const cofins = produto.imposto[0].COFINS[0].COFINSAliq[0];
        valorCOFINS = parseFloat(cofins.vCOFINS[0]);
      }
  
      // Calcular o valor total com impostos
      const valorComImpostos = valorProduto + valorIPI;
  
      this.produtos.push({
        nome: nomeProduto,
        valor: valorProduto,
        valorICMS: valorICMS,
        valorIPI: valorIPI,
        valorPIS: valorPIS,
        valorCOFINS: valorCOFINS,
        valorComImpostos: valorComImpostos
      });
  
      this.totalValor += valorProduto;
      this.totalICMS += valorICMS;
      this.totalIPI += valorIPI;
      this.totalPIS += valorPIS;
      this.totalCOFINS += valorCOFINS;
      this.totalNota += valorComImpostos;
    });
  
  }
  
  

}
