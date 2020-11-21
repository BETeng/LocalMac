class App {
    constructor(company, location, date){
        this.company = company;
        this.location = location;
        this.date= date;
    }
}

class UI {
    static displayApps(){
        const apps = Store.getApps();

        apps.forEach(app => UI.addAppToList(app))
    }
    static addAppToList(app){
        const list = document.querySelector('#app-list');

        const row = document.createElement('tr')

        row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.location}</td>
        <td>${app.date}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteApp(el){
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div'); 
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#app-form');
        container.insertBefore(div, form);
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#company').value = '';
        document.querySelector('#location').value = '';
        document.querySelector('#date').value = '';
    }
}

class Store {
    static getApps(){
        let apps;
        if(localStorage.getItem('apps')===null){
            apps = [];
        } else {
            apps = JSON.parse(localStorage.getItem('apps'));
        }
        return apps;
    }

    static addApp(app){
        const apps = Store.getApps();
        apps.push(app);
        localStorage.setItem('apps', JSON.stringify(apps));
    }

    static removeApp(location){
        const apps = Store.getApps();

        apps.forEach((app, index)=>{
            if(app.location === location) {
                console.log('app.location === location')
               apps.splice(index, 1); 
            }
        })
        localStorage.setItem('apps', JSON.stringify(apps))
    }
}

document.addEventListener('DOMContentLoaded', UI.displayApps);

document.querySelector('#app-form').addEventListener('submit', (e) => {

    e.preventDefault();

    const company = document.querySelector('#company').value;
    const location = document.querySelector('#location').value;
    const date = document.querySelector('#date').value;

    if(company === '' || location ==='' || date=== '' ){
        UI.showAlert('Fill in all the fields, stoopid', 'danger');
    }
    else{
        const app = new App(company, location, date);
     
        UI.addAppToList(app);
        Store.addApp(app);

        UI.showAlert('Application Added', 'success');
    
        UI.clearFields();
    }

   
})

document.querySelector('#app-list').addEventListener('click', e => {
    UI.deleteApp(e.target);
    Store.removeApp(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    UI.showAlert('Entry Deleted', 'info');
})