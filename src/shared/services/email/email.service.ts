import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendNewFormNotification(formData: any, adminEmails: string[]) {
    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to: adminEmails.join(', '),
      subject: `📋 Novo Formulário Recebido - ${formData.nomeEmpresa}`,
      html: this.generateFormEmailTemplate(formData),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado com sucesso:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }
  }

  private generateFormEmailTemplate(formData: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Novo Formulário Recebido</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8f9fa; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #495057; }
          .value { margin-left: 10px; }
          .footer { text-align: center; padding: 20px; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📋 Novo Formulário Recebido</h2>
            <p>Um novo formulário foi submetido em ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          
          <div class="content">
            <h3>Informações do Cliente:</h3>
            
            <div class="field">
              <span class="label">Nome:</span>
              <span class="value">${formData.nome}</span>
            </div>
            
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${formData.email}</span>
            </div>
            
            <div class="field">
              <span class="label">Telefone:</span>
              <span class="value">${formData.telefone}</span>
            </div>
            
            <div class="field">
              <span class="label">Empresa:</span>
              <span class="value">${formData.nomeEmpresa}</span>
            </div>
            
            <div class="field">
              <span class="label">Objetivo do Site:</span>
              <span class="value">${formData.siteObjetivo}</span>
            </div>
            
            <div class="field">
              <span class="label">Público Alvo:</span>
              <span class="value">${formData.publicoAlvo}</span>
            </div>
            
            <div class="field">
              <span class="label">Site de Referência:</span>
              <span class="value">${formData.siteReferencia}</span>
            </div>
            
            <div class="field">
              <span class="label">Tipo de Conteúdo:</span>
              <span class="value">${formData.tipoConteudo}</span>
            </div>
            
            ${formData.dominio ? `
            <div class="field">
              <span class="label">Domínio:</span>
              <span class="value">${formData.dominio}</span>
            </div>
            ` : ''}
            
            ${formData.emailProfissional ? `
            <div class="field">
              <span class="label">Email Profissional:</span>
              <span class="value">${formData.emailProfissional}</span>
            </div>
            ` : ''}
            
            ${formData.funcionalidades ? `
            <div class="field">
              <span class="label">Funcionalidades:</span>
              <span class="value">${formData.funcionalidades}</span>
            </div>
            ` : ''}
            
            ${formData.observacoes ? `
            <div class="field">
              <span class="label">Observações:</span>
              <span class="value">${formData.observacoes}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>Este email foi enviado automaticamente pelo sistema Flex API</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}