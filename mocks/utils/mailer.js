// __mocks__/utils/mailer.js
module.exports = {
    transporter: {
      verify: jest.fn().mockResolvedValue(true),
    },
  };
  