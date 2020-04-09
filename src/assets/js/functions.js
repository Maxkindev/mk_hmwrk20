'use strict';
function createHtmlElement(elemObjName, elemCssClassName, elemObjContent, attrArray) {
  if (!elemObjName) {
    return;
  }
  // else
  const newHtmlElem = document.createElement(elemObjName);

  if (elemCssClassName) {
    newHtmlElem.classList.add(elemCssClassName);
  }

  if (elemObjContent) {
    newHtmlElem.textContent = elemObjContent;
  }

  if (attrArray) {  // [{attrName: '', attrValue: ''}, ...] or undefined
    attrArray.forEach(elemOfArr => {
      newHtmlElem.setAttribute(elemOfArr.attrName, elemOfArr.attrValue);
    });
  }

  return newHtmlElem;
}

function initChat() {
  const wrapper = createHtmlElement('div', 'wrapper', null);
  document.body.prepend(wrapper);

  const title = createHtmlElement('h2', 'title', 'MK ASYNC CHAT');
  wrapper.before(title);

  const mainChat = createHtmlElement('ul', 'list', null);
  wrapper.append(mainChat);

  const textareaWrapper = createHtmlElement('div', 'wrapper-textarea', null);
  mainChat.after(textareaWrapper);
  const textarea = createHtmlElement('textarea', 'input-textarea', null, [ {attrName: 'name', attrValue: 'textareaMessage'} ]);
  textareaWrapper.append(textarea);

  const sendBtn = createHtmlElement(
    'input',
    'btn',
    null,
    [
      {
        attrName: 'type',
        attrValue: 'button'
      },
      {
        attrName: 'value',
        attrValue: 'Send'
      }
    ]
  );
  sendBtn.classList.add('btn--send');
  textareaWrapper.append(sendBtn);

  addListenerToTextAreaWrapper();
}

function addNewMessageRow(sender, text) {
  const newMessage = createHtmlElement('li', 'new-message', text, [ {attrName:'data-message-sender', attrValue: sender} ]);
  document.querySelector('.list').append(newMessage);
  const spanSender = createHtmlElement('span', 'span-sender', `${sender}: `);
  newMessage.prepend(spanSender);

  document.querySelector('.list').scrollTop = document.querySelector('.list').scrollHeight;
}

function addListenerToTextAreaWrapper() { 
  document.querySelector('.wrapper-textarea').addEventListener('click', (event) => {
    if (event.target.matches('.btn--send') && document.querySelector('.input-textarea').value !== '') {
      if (document.querySelector('.input-textarea').value === 'bye') {
        addNewMessageRow('Human', document.querySelector('.input-textarea').value + `, I NEED TO GO`);
        event.target.disabled = true;
      } else {
        addNewMessageRow('Human', document.querySelector('.input-textarea').value);
      }
      document.querySelector('.input-textarea').value = '';

      getBotAnswer(event);
    }
  });
}

function timeout(message, time = 0) {
  return new Promise(done => {
    setTimeout(() => done(message), time * 1000);
  });
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function randomMessage() {
  const message = [
    `Hi`,
    `How're you doing?`,
    `Greetings`,
    `What's up?`,
    `Are you sure?`,
    `Seriously?`,
    `Nah, I don't believe you!`,
    `This is insane`,
    `Have you finished you homework?`,
    `What is closure?`,
    `What is event loop?`,
    `What is arrow function?`,
    `What is prototype?`,
    `What is promise?`,
    `What is fetch?`,
    `How does HTTP work?`,
  ][rand(0, 15)];

  return timeout(message, rand(1, 10));
}

async function getBotAnswer(event) {
  if (event.target.disabled) {
    addNewMessageRow('Bot', `Have a nice day, Human!`);
    return;
  }

  const botMood = await checkBotMood();
  if (botMood === 'Destroy humanity') {
    addNewMessageRow('Bot', `Goodbye annoying Human!`);
    document.querySelector('.input-textarea').value = 'You are blocked';
    document.querySelector('.input-textarea').disabled = true;
    event.target.disabled = true;

    return botMood;
  }

  const botMessage = await randomMessage();
  addNewMessageRow('Bot', botMessage);
  return botMessage;
}

async function checkBotMood() {
  const synthMood = [
    `Destroy humanity`,
    `Good`,
    `Super`,
    `Pretty good`,
    `Relaxed`,
    `She's a maniac`
  ][rand(0, 5)];

  return timeout(synthMood, rand(1, 3));
}