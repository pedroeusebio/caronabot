import botBuilder from 'claudia-bot-builder';
import R from 'ramda';

const fbTemplate = botBuilder.fbTemplate;

function textResponse(text, quickReply = []) {
  let msg = new fbTemplate.Text(text);
  R.forEach((el) => msg.addQuickReply(el,el), quickReply);
  return msg.get();
}

function buttonResponse(text, buttons = []) {
  let msg = new fbTemplate.Button(text);
  R.forEach((el) => msg.addButton(el.label,el.value), buttons);
  return msg.get();

}

export default {
  textResponse,
  buttonResponse,
};
