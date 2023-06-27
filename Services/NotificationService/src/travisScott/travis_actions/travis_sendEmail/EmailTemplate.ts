/**
 * Email Template
 */

import { ContactResOwner} from "../../travis_types/typeModels";

export class EmailTemplate {
    static forContactResOwner(data: ContactResOwner): string{
        const html = `
        <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title></title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    table, td, div, h1, p {font-family: Arial, sans-serif;}
  </style>
</head>
<body style="margin:0;padding:0;">
  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
          <tr>
            <td align="center" style="padding:40px 0 30px 0;background:black;color:white;">
              <img width="250px" src="https://evaclue.com/evaclue_icons/logoEvaclue_v2.png" />
            </td>
          </tr>
          <tr>
            <td style="padding:36px 30px 42px 30px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                <tr>
                  <td style="padding:0 0 36px 0;color:#153643;">
                    <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${data.userName}</h1>
                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">${data.message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;background:black;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                <tr>
                  <td style="padding:0;width:50%;" align="left">
                    <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                      &reg; Evaclue, 2023<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;">https://www.evaclue.com</a>
                    </p>
                  </td>
                  <td style="padding:0;width:50%;" align="right">
                    <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                        <td style="padding:0 0 0 10px;width:38px;">
                          <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                        </td>
                        <td style="padding:0 0 0 10px;width:38px;">
                          <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
        return html
    }

    static forSubscription(): string{
        const html = `
        <!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title></title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    table, td, div, h1, p {font-family: Arial, sans-serif;}
  </style>
</head>
<body style="margin:0;padding:0;">
  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
          <tr>
            <td align="center" style="padding:40px 0 30px 0;background:black;">
            <img width="250px" src="https://evaclue.com/evaclue_icons/logoEvaclue_v2.png" />
            </td>
          </tr>
          <tr>
            <td style="padding:36px 30px 42px 30px;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                <tr>
                  <td style="padding:0 0 36px 0;color:#153643;">
                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">É com grande satisfação que anunciamos o lançamento da Evaclue, a plataforma de aluguer de propriedades que está a mudar a forma como as pessoas procuram e alugam casas.
                      Com a Evaclue, pode facilmente encontrar uma casa que corresponda às suas necessidades, através de informações detalhadas e comentários de proprietários e inquilinos anteriores. Os proprietários de imóveis, por sua vez, têm a oportunidade de encontrar inquilinos confiáveis e de qualidade.
                      A nossa plataforma foi concebida para tornar o processo de aluguer de propriedades mais fácil e transparente, fornecendo informações úteis e confiáveis. Além disso, a Evaclue está a simplificar e a possibilitar uma conexão direta entre inquilinos e proprietários de imóveis para contratos de arrendamento a longo prazo, eliminando intermediários e taxas desnecessárias.
                      Temos orgulho em oferecer uma experiência única aos nossos utilizadores, com uma interface intuitiva, fácil de usar e repleta de recursos úteis. A Evaclue também oferece segurança e proteção para todos os utilizadores, graças à nossa abordagem rigorosa na verificação da identidade e histórico dos inquilinos e proprietários.
                      Estamos muito animados com o lançamento da Evaclue, por isso convidamos todos os interessados a experimentar a plataforma. Junte-se à nossa comunidade, subscreva a nossa Newsletter e esteja entre os primeiros a desfrutar desta nova plataforma.</p>
                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Agradecemos a sua atenção e esperamos tê-lo(a) como um dos nossos utilizadores em breve.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;background:black;">
              <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                <tr>
                  <td style="padding:0;width:50%;" align="left">
                    <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                      &reg; Evaclue, 2023<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;">https://www.evaclue.com</a>
                    </p>
                  </td>
                  <td style="padding:0;width:50%;" align="right">
                    <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                        <td style="padding:0 0 0 10px;width:38px;">
                          <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                        </td>
                        <td style="padding:0 0 0 10px;width:38px;">
                          <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `

        return html
    }
}
