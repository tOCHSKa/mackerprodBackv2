// __tests__/sendMail.test.js

// Mock du transporter
const sendMailModule = require('../utils/sendMail');

const mockSendMail = jest.fn();

jest.mock('../utils/mailer', () => ({
  transporter: {
    sendMail: (mailOptions) => mockSendMail(mailOptions),
  }
}));

describe('sendMail', () => {
  beforeEach(() => {
    mockSendMail.mockReset();
  });

  it('✅ envoie un email avec les bons paramètres et log le messageId', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // On simule la réponse de sendMail
    mockSendMail.mockResolvedValue({ messageId: '12345' });

    await sendMailModule.sendMail(
      'destinataire@example.com',
      'Sujet de test',
      'Texte du mail',
      '<p>HTML du mail</p>'
    );

    expect(mockSendMail).toHaveBeenCalledWith({
      from: "toch59200@gmail.com",
      to: 'destinataire@example.com',
      subject: 'Sujet de test',
      text: 'Texte du mail',
      html: '<p>HTML du mail</p>'
    });

    expect(consoleLogSpy).toHaveBeenCalledWith("Message envoyé: %s", '12345');

    consoleLogSpy.mockRestore();
  });

  it('❌ capture et log l\'erreur si l\'envoi échoue', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const error = new Error('Erreur SMTP');
    mockSendMail.mockRejectedValue(error);

    await sendMailModule.sendMail(
      'destinataire@example.com',
      'Sujet erreur',
      'Texte erreur',
      '<p>HTML erreur</p>'
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Erreur lors de l'envoi de l'email:",
      error
    );

    consoleErrorSpy.mockRestore();
  });
});
