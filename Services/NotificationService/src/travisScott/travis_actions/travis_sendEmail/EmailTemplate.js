"use strict";
/**
 * Email Template
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = void 0;
class EmailTemplate {
    static forContactResOwner(data) {
        const html = `
        <h6>Message From ${data.userName}</h6>
        <br/>
        <hr/>
        <p>${data.message}</p>
        `;
        return html;
    }
    static forSubscription() {
        /*const html = `
        <p><É com grande satisfação que anunciamos o lançamento da Evaclue, a plataforma de aluguer de propriedades que está a mudar a forma como as pessoas procuram e alugam casas.
Com a Evaclue, pode facilmente encontrar uma casa que corresponda às suas necessidades, através de informações detalhadas e comentários de proprietários e inquilinos anteriores. Os proprietários de imóveis, por sua vez, têm a oportunidade de encontrar inquilinos confiáveis e de qualidade.
A nossa plataforma foi concebida para tornar o processo de aluguer de propriedades mais fácil e transparente, fornecendo informações úteis e confiáveis. Além disso, a Evaclue está a simplificar e a possibilitar uma conexão direta entre inquilinos e proprietários de imóveis para contratos de arrendamento a longo prazo, eliminando intermediários e taxas desnecessárias.</p><p>
Temos orgulho em oferecer uma experiência única aos nossos utilizadores, com uma interface intuitiva, fácil de usar e repleta de recursos úteis. A Evaclue também oferece segurança e proteção para todos os utilizadores, graças à nossa abordagem rigorosa na verificação da identidade e histórico dos inquilinos e proprietários.
Estamos muito animados com o lançamento da Evaclue, por isso convidamos todos os interessados a experimentar a plataforma. Junte-se à nossa comunidade, subscreva a nossa Newsletter e esteja entre os primeiros a desfrutar desta nova plataforma.
Agradecemos a sua atenção e esperamos tê-lo(a) como um dos nossos utilizadores em breve.

Atentamente,
Equipa Evaclue/p>
        `*/
        const html = "<p>teste de teste</p>";
        return html;
    }
}
exports.EmailTemplate = EmailTemplate;
