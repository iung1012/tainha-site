const { Resend } = require('resend');
const { generateQrCodeBase64 } = require('./ticket');

const FROM = process.env.EMAIL_FROM || 'Tainha do Mar <noreply@tainhadomar.com.br>';
// Inicialização lazy para não quebrar quando RESEND_API_KEY não está definida
let _resend = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

async function sendTicketEmail({ order, items, tickets }) {
  const ticketsWithQr = await Promise.all(
    tickets.map(async (t) => ({
      ...t,
      qrCode: await generateQrCodeBase64(t.ticket_code),
    }))
  );

  const ticketRows = ticketsWithQr
    .map(
      (t) => `
      <div style="border:2px solid #0077B6;border-radius:12px;padding:24px;margin:16px 0;background:#F0F9FF;text-align:center;">
        <p style="font-size:12px;color:#64748B;margin:0 0 4px;">Código do Ingresso</p>
        <p style="font-size:14px;font-weight:700;color:#023E8A;letter-spacing:2px;margin:0 0 16px;">${t.ticket_code}</p>
        <img src="${t.qrCode}" width="180" height="180" alt="QR Code" style="display:block;margin:0 auto 12px;" />
        <p style="font-size:12px;color:#64748B;margin:0;">Apresente este QR Code na entrada</p>
      </div>`
    )
    .join('');

  const itemRows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;color:#1E293B;">${i.product_name}</td>
        <td style="padding:8px 0;text-align:center;color:#1E293B;">${i.quantity}</td>
        <td style="padding:8px 0;text-align:right;color:#1E293B;">${formatBRL(i.unit_price * i.quantity)}</td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0F9FF;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F9FF;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,119,182,0.1);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#023E8A 0%,#0077B6 50%,#00B4D8 100%);padding:40px 32px;text-align:center;">
          <p style="font-size:28px;font-weight:800;color:#fff;margin:0;letter-spacing:-0.5px;">🐟 Tainha do Mar</p>
          <p style="font-size:14px;color:#BAE6FD;margin:8px 0 0;">Confirmação de Pedido</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="font-size:20px;font-weight:700;color:#023E8A;margin:0 0 8px;">Olá, ${order.customer_name}!</p>
          <p style="color:#475569;margin:0 0 24px;">Seu pagamento foi confirmado. Confira seus ingressos abaixo.</p>

          <!-- Order info -->
          <div style="background:#F0F9FF;border-radius:8px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 4px;font-size:12px;color:#64748B;">PEDIDO Nº</p>
            <p style="margin:0;font-size:18px;font-weight:700;color:#023E8A;">#${String(order.id).padStart(6, '0')}</p>
          </div>

          <!-- Items table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <thead>
              <tr style="border-bottom:2px solid #E0F2FE;">
                <th style="text-align:left;padding:8px 0;font-size:12px;color:#64748B;font-weight:600;">ITEM</th>
                <th style="text-align:center;padding:8px 0;font-size:12px;color:#64748B;font-weight:600;">QTD</th>
                <th style="text-align:right;padding:8px 0;font-size:12px;color:#64748B;font-weight:600;">VALOR</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
              <tr style="border-top:2px solid #E0F2FE;">
                <td colspan="2" style="padding:12px 0;font-weight:700;color:#023E8A;">Total Pago</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#023E8A;font-size:18px;">${formatBRL(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Tickets -->
          <p style="font-size:16px;font-weight:700;color:#023E8A;margin:0 0 8px;">Seus Ingressos</p>
          ${ticketRows}

          <div style="background:#DCFCE7;border:1px solid #BBF7D0;border-radius:8px;padding:16px;margin-top:24px;">
            <p style="margin:0;color:#166534;font-size:14px;">✅ Apresente o QR Code na entrada do evento. Cada QR Code é válido para uma pessoa.</p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F8FAFC;padding:24px 32px;text-align:center;border-top:1px solid #E0F2FE;">
          <p style="margin:0;font-size:12px;color:#94A3B8;">Tainha do Mar · Dúvidas? Entre em contato conosco.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 [DEV] Email de ingressos seria enviado para ${order.customer_email} (pedido #${order.id})`);
    return;
  }
  await getResend().emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `🐟 Seus ingressos chegaram! Pedido #${String(order.id).padStart(6, '0')}`,
    html,
  });
}

async function sendOrderConfirmationEmail({ order }) {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:'Segoe UI',sans-serif;background:#F0F9FF;padding:40px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,119,182,0.1);">
    <div style="background:linear-gradient(135deg,#023E8A,#0077B6,#00B4D8);padding:32px;text-align:center;">
      <p style="font-size:24px;font-weight:800;color:#fff;margin:0;">🐟 Tainha do Mar</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:18px;font-weight:700;color:#023E8A;">Pedido recebido!</p>
      <p style="color:#475569;">Olá, ${order.customer_name}! Seu pedido #${String(order.id).padStart(6, '0')} foi criado com sucesso.</p>
      <p style="color:#475569;">Assim que o pagamento PIX for confirmado, você receberá os ingressos neste email.</p>
      <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px;margin-top:16px;">
        <p style="margin:0;color:#9A3412;font-size:14px;">⏱ O PIX expira em 1 hora. Pague agora para garantir seu lugar!</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 [DEV] Email de confirmação seria enviado para ${order.customer_email} (pedido #${order.id})`);
    return;
  }
  await getResend().emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `Pedido recebido #${String(order.id).padStart(6, '0')} — aguardando pagamento`,
    html,
  });
}

function formatBRL(cents) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

module.exports = { sendTicketEmail, sendOrderConfirmationEmail };
