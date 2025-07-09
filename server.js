const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro provedor de email
    auth: {
        user: process.env.EMAIL_USER || 'seu-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'sua-senha-de-app'
    }
});

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para processar o formulário de contato
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        
        // Validação básica
        if (!name || !email || !phone || !service || !message) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios.'
            });
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email inválido.'
            });
        }
        
        // Configuração do email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'seu-email@gmail.com',
            to: process.env.CONTACT_EMAIL || 'contato@techrepair.com.br',
            subject: `Novo contato - ${service}`,
            html: `
                <h2>Novo contato recebido pelo site</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Serviço:</strong> ${service}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><em>Enviado através do formulário de contato do site TechRepair</em></p>
            `
        };
        
        // Email de confirmação para o cliente
        const confirmationMailOptions = {
            from: process.env.EMAIL_USER || 'seu-email@gmail.com',
            to: email,
            subject: 'Confirmação de contato - TechRepair',
            html: `
                <h2>Obrigado pelo seu contato!</h2>
                <p>Olá ${name},</p>
                <p>Recebemos sua mensagem sobre <strong>${service}</strong> e entraremos em contato em breve.</p>
                <p>Nossa equipe analisará sua solicitação e retornará o mais rápido possível.</p>
                <br>
                <p><strong>Resumo da sua mensagem:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Atenciosamente,<br>
                <strong>Equipe TechRepair</strong><br>
                Telefone: (11) 9 9999-9999<br>
                Email: contato@techrepair.com.br</p>
            `
        };
        
        // Enviar emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(confirmationMailOptions);
        
        res.json({
            success: true,
            message: 'Mensagem enviada com sucesso! Você receberá uma confirmação por email.'
        });
        
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor. Tente novamente mais tarde.'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;