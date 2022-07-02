const apiKey = "cec7ca32-d796-4e26-b7dd-1a9cc4d53968";
const apiHost = 'https://todo-api.coderslab.pl';

//Connection
function apiListTasks() {
    return fetch(
        apiHost + '/api/tasks',
        {
            headers: { Authorization: apiKey }
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}