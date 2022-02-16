import TodoApi from "./TodoApi.js";

'use strict'

const MAX_NUMBER = 100;
const MIN_NUMBER = 10;
const FILL_FIELD = 'Error';
const TODO_ITEM_CLASS = 'contactItem';
const DELETE_BUTTON_CLASS = 'delete-button';
const DONE_CLASS = 'done';

const nameInput = document.querySelector('#nameInput')
const surnameInput = document.querySelector('#surnameInput')
const phoneInput = document.querySelector('#phoneInput')
const contactEl = document.querySelector('#contactList');
const todoForm = document.querySelector('#contactForm')
const todoTemplateHTML = document.querySelector('#contactItemTemplate').innerHTML;

let listContact = [];

todoForm.addEventListener('submit', onContactFormSubmit);
contactEl.addEventListener('click', onContactListClick);

init();

function init() {
    TodoApi.getList()
        .then((list) => {
            listContact = list;
            renderContactList(list)
        })
        .catch(handleError);
}

function onContactFormSubmit(event) {
    event.preventDefault();
    const contact = getContact();

    if (!isContactValid(contact)) {
        warning();
        return;
    }

    if (contact.id) {
        updateContact(contact);
    } else {
        contact.id = getTempId();

        createContact(contact);
    }
    listContactAddItem(contact);
    clear();
}

function getTempId() {
    return `temp_${Math.random() * (MAX_NUMBER - MIN_NUMBER) + MIN_NUMBER}`;
}

function onContactListClick(event) {
    const todoEl = getContactElement(event.target)
    const classList = event.target.classList;

    if (todoEl) {

        if (classList.contains(DELETE_BUTTON_CLASS)) {
            removeContact(todoEl);
        }

        if (classList.contains(TODO_ITEM_CLASS)) {
            toggleDone(todoEl);
        }
    }
}

function listContactAddItem(contact) {
    listContact.push(contact);

    let contactItemHTML = todoTemplateHTML;

    contactItemHTML = generateContactHtml(contact);

    contactEl.insertAdjacentHTML('beforeend', contactItemHTML);
}

function getContact() {
    return {
        firstName: nameInput.value,
        lastName: surnameInput.value,
        phone: phoneInput.value
    };
}

function updateContact(contact) {
    TodoApi
        .update(contact.id, contact)
        .then(() => {
            init();
        })
        .catch(handleError);
}

function createContact(contact) {
    TodoApi
        .create(contact)
        .then((contactFromServer) => {
            setServerId(contactFromServer, contact.id);

            renderContactList(listContact);
        })
        .catch(handleError);
}

function getContactElement(target) {
    return target.closest('.' + TODO_ITEM_CLASS);
}

function setServerId(contactFromServer, tempId) {
    const newTodoIndex = listContact.findIndex(item => item.id === tempId);

    listContact[newTodoIndex].id = contactFromServer.id;
}

function renderContactList(contactList) {
    const html = contactList.map(generateContactHtml).join('');
    contactEl.innerHTML = html;
}

function generateContactHtml(contact) {
    const done = contact.status ? DONE_CLASS : '';

    return todoTemplateHTML
        .replace('{{id}}', contact.id)
        .replaceAll('{{name}}', contact.firstName)
        .replaceAll('{{surname}}', contact.lastName)
        .replaceAll('{{phone}}', contact.phone)
        .replace('{{done}}', done);
}

function removeContact(contactEl) {
    const id = getContactElId(contactEl);

    TodoApi
        .delete(id)
        .catch(handleError);
    contactEl.remove();
}

function toggleDone(contactEl) {
    const id = getContactElId(contactEl);

    TodoApi
        .update(id)
        .catch(handleError);

    contactEl.classList.toggle(DONE_CLASS);
}

function getContactElId(element) {
    return element.dataset.id;
}

function clear() {
    todoForm.reset();
}

function handleError(event) {
    alert(event.message);
}

function warning() {
    alert(FILL_FIELD);
}

function isContactValid(contact) {
    return !isEmpty(contact.firstName)
        && !isEmpty(contact.lastName)
        && isPhone(contact.phone)
}

function isPhone(phone) {
    return !isEmpty(phone) && !isNaN(phone);
}

function isEmpty(string) {
    return typeof string === 'string' && string.trim() === '';
}