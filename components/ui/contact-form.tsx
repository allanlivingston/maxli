export const ContactForm = () => (
  <>
    <form name="subscribe" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
      <input type="email" name="email" />
      <input type="hidden" name="form-name" value="subscribe" />
      <input type="hidden" name="message" value="subscribe" />
    </form>
  </>
) 