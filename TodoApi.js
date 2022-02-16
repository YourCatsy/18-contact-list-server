class TodoApi {
    static URL = 'https://6207d30f22c9e90017d32f1f.mockapi.io/api/todo/';

    static getList() {
        return fetch(this.URL).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Нет списка.');
        });
    }

    static getOne(id) {
        return fetch(this.URL + id).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Нет строки с id '${id}'.`);
        });
    }

    static create(todo) {
        return fetch(this.URL, {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Невозможно создать список.');
        });
    }
    static update(id, todo) {
        return fetch(this.URL + id, {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Невозможно обновить список.');
        });
    }
    static delete(id) {
        return fetch(this.URL + id, {
            method: 'DELETE',
        }).then((response) => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }

            throw new Error('Невозможно удалить список.');
        });
    }
}

export default TodoApi;