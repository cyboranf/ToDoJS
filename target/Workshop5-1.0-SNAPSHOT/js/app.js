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


// function renderTask(taskId, title, description, status) {
//     const section = document.createElement('section');
//     section.className = 'card mt-5 shadow-sm';
//     document.querySelector('main').appendChild(section);
//
//     const headerDiv = document.createElement('div');
//     headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
//     section.appendChild(headerDiv);
//
//     const headerLeftDiv = document.createElement('div');
//     headerDiv.appendChild(headerLeftDiv);
//
//     const h5 = document.createElement('h5');
//     h5.innerText = title;
//     headerLeftDiv.appendChild(h5);
//
//     const h6 = document.createElement('h6');
//     h6.className = 'card-subtitle text-muted';
//     h6.innerText = description;
//     headerLeftDiv.appendChild(h6);
//
//     const headerRightDiv = document.createElement('div');
//     headerDiv.appendChild(headerRightDiv);
//
//     // kiedy zadanie ma status "closed", nie chcemy widzieć przycisku "Finish"
//     if(status == 'open') {
//         const finishButton = document.createElement('button');
//         finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
//         finishButton.innerText = 'Finish';
//         headerRightDiv.appendChild(finishButton);
//         // tu znajdzie się obsługa kliknięcia przycisku "Finish"
//     }
//
//     const deleteButton = document.createElement('button');
//     deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
//     deleteButton.innerText = 'Delete';
//     headerRightDiv.appendChild(deleteButton);
//     // tu znajdzie się obsługa kliknięcia przycisku "Delete"
//
//     const ul = document.createElement('ul');
//     ul.className = 'list-group list-group-flush';
//     section.appendChild(ul);
//
//     // tu znajdzie się kod który wypełni (utworzoną 4 linie wyżej) listę <ul>
//
//     // formularz dodawania nowych operacji chcemy widzieć tylko w otwartych zadaniach
//     if(status == 'open') {
//         const addOperationDiv = document.createElement('div');
//         addOperationDiv.className = 'card-body js-task-open-only';
//         section.appendChild(addOperationDiv);
//
//         const form = document.createElement('form');
//         addOperationDiv.appendChild(form);
//
//         const inputGroup = document.createElement('div');
//         inputGroup.className = 'input-group';
//         form.appendChild(inputGroup);
//
//         const descriptionInput = document.createElement('input');
//         descriptionInput.setAttribute('type', 'text');
//         descriptionInput.setAttribute('placeholder', 'Operation description');
//         descriptionInput.setAttribute('minlength', '5');
//         descriptionInput.className = 'form-control';
//         inputGroup.appendChild(descriptionInput);
//
//         const inputGroupAppend = document.createElement('div');
//         inputGroupAppend.className = 'input-group-append';
//         inputGroup.appendChild(inputGroupAppend);
//
//         const addButton = document.createElement('button');
//         addButton.className = 'btn btn-info';
//         addButton.innerText = 'Add';
//         inputGroupAppend.appendChild(addButton);
//
//         // tu znajdzie się obsługa wysłania formularza
//     }
// }
//
// document.addEventListener('DOMContentLoaded', function() {
//     apiListAllTasks().then(
//         function(response) {
//             response.data.forEach(
//                 function(task) {
//                     renderTask(task.id, task.title, task.description, task.status);
//                 }
//             )
//         }
//     );
// });

document.addEventListener('DOMContentLoaded', function () {
    /* Listing tasks */
    apiListTasks()
        .then(function (data) {
            data.data.forEach(function (task) {
                renderTask(task.id, task.title, task.description, task.status);
            });
        });

    /* Creating task */
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const title = document.querySelector("#title").value;
        const description = document.querySelector("#description").value;

        apiCreateTask(title, description)
            .then(function () {
                apiListTasks()
                    .then(function (data) {
                        data.data.forEach(function (task) {
                            renderTask(task.id, task.title, task.description, task.status);
                        });
                    });
            });
    });

});

/* Fetching all tasks from server */
function apiListTasks() {
    return fetch(apiHost + "/api/tasks", {
        headers: {
            "Authorization": apiKey
        }
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można wczytać danych.");
            console.log(err);
        });
}

/* Adding a new section with task to the html */
function renderTask(taskId, title, description, status) {
    const main = document.querySelector("main");
    const section = document.createElement("section");
    section.className = 'card mt-5 shadow-sm';
    main.appendChild(section);

    const headerDiv = document.createElement("div");
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement("div");
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement("h5");
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement("h6");
    h6.className = "card-subtitle text-muted";
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);
    if (status === "open") {
        const finishButton = document.createElement("button");
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);

        finishButton.addEventListener("click", function () {
            apiUpdateTask(taskId, title, description, "closed")
                .then(function () {
                    const openOnlyElements = section.querySelectorAll(".js-task-open-only");
                    openOnlyElements.forEach(function (element) {
                        element.remove();
                    });
                });
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';

    deleteButton.addEventListener("click", function () {
        apiDeleteTask(taskId)
            .then(function () {
                section.remove();
            })
    });
    headerRightDiv.appendChild(deleteButton);

    const ul = document.createElement('ul');
    ul.className = "list-group list-group-flush";
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(function (operation) {
                    renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
                }
            );
        }
    );

    /* Rendering input section for creating operations */
    const divBottom = document.createElement("div");
    divBottom.className = "card-body js-task-open-only";
    const formInput = document.createElement("form");
    const divInput = document.createElement("div");
    divInput.className = "input-group";
    const inputOperation = document.createElement("input");
    inputOperation.className = "form-control";
    inputOperation.placeholder = "Operation description";
    inputOperation.type = "text";
    inputOperation.minLength = 5;
    const divButton = document.createElement("div");
    divButton.className = "input-group-append";
    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-info";
    submitButton.innerText = "Add";
    divButton.appendChild(submitButton);
    divInput.appendChild(inputOperation);
    divInput.appendChild(divButton);
    formInput.appendChild(divInput);
    divBottom.appendChild(formInput);
    section.appendChild(divBottom);

    formInput.addEventListener("submit", function (e) {
        e.preventDefault();
        apiCreateOperationForTask(taskId, inputOperation.value)
            .then(function (data) {
                const operation = data.data;
                renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
            });
    });

}

/* Fetching operations for given task id */
function apiListOperationsForTask(taskId) {
    return fetch(apiHost + `/api/tasks/${taskId}/operations`, {
        headers: {
            "Authorization": apiKey
        }
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można wczytać danych.");
            console.log(err);
        });
}

/* Adding new li (operation to the given ul (list of operation) */
function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    operationsList.appendChild(li);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement("span");
    time.className = "badge badge-success badge-pill ml-2"
    time.innerText = timeRefactor(timeSpent);
    descriptionDiv.appendChild(time);

    if (status === "open") {
        const manageOperation = document.createElement("div");
        manageOperation.className = "js-task-open-only";
        const timeButton15m = document.createElement("button");
        timeButton15m.innerText = "+15m";
        timeButton15m.className = "btn btn-outline-success btn-sm mr-2";
        const timeButton1h = document.createElement("button");
        timeButton1h.innerText = "+1h";
        timeButton1h.className = "btn btn-outline-success btn-sm mr-2";
        const deleteOperationButton = document.createElement("button");
        deleteOperationButton.className = "btn btn-outline-danger btn-sm";
        deleteOperationButton.innerText = "Delete";
        manageOperation.append(timeButton15m, timeButton1h, deleteOperationButton);
        li.append(manageOperation);

        timeButton15m.addEventListener("click", function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 15)
                .then(function (response) {
                    timeSpent = response.data.timeSpent;
                    time.innerText = timeRefactor(timeSpent);
                });
        });
        timeButton1h.addEventListener("click", function () {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60)
                .then(function (response) {
                    timeSpent = response.data.timeSpent;
                    time.innerText = timeRefactor(timeSpent);
                });
        });
        deleteOperationButton.addEventListener("click", function () {
            apiDeleteOperation(operationId)
                .then(function () {
                    li.remove();
                });
        });
    }
}

/* Calculating time in minutes to time in hours and minutes (e.g. 70m to 1h 10m) */
function timeRefactor(timeInMinutes) {
    if (timeInMinutes === 0) {
        return "0m";
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    if (hours === 0) {
        return `${minutes}m`;
    }
    if (minutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
}

/* Creating tasks */
function apiCreateTask(title, description) {
    return fetch(apiHost + "/api/tasks", {
        headers: {"Authorization": apiKey, "Content-Type": "application/json"},
        body: JSON.stringify({title: title, description: description, status: "open"}),
        method: "POST"
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można dodać danych.");
            console.log(err);
        });
}

/* Deleting tasks */
function apiDeleteTask(taskId) {
    return fetch(apiHost + "/api/tasks/" + taskId, {
        headers: {"Authorization": apiKey},
        method: "DELETE"
    })
        .then(function (res) {
            if (!res.ok) {
                throw new Error("Deleting failed");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

/* Adding operations to task */
function apiCreateOperationForTask(taskId, description) {
    return fetch(apiHost + `/api/tasks/${taskId}/operations`, {
        headers: {"Authorization": apiKey, "Content-Type": "application/json"},
        body: JSON.stringify({description: description}),
        method: "POST"
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można dodać danych.");
            console.log(err);
        });
}

/* Updating task operations */
function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(apiHost + `/api/operations/${operationId}`, {
        headers: {"Authorization": apiKey, "Content-Type": "application/json"},
        body: JSON.stringify({description: description, timeSpent: timeSpent}),
        method: "PUT"
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można dodać czasu.");
            console.log(err);
        })
}

/* Deleting task operations */
function apiDeleteOperation(operationId) {
    return fetch(apiHost + `/api/operations/${operationId}`, {
        headers: {"Authorization": apiKey},
        method: "DELETE"
    })
        .then(function (res) {
            if (!res.ok) {
                throw new Error("Deleting failed");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

/* Setting task as finished */
function apiUpdateTask(taskId, title, description, status) {
    return fetch(apiHost + `/api/tasks/${taskId}`, {
        headers: {"Authorization": apiKey, "Content-Type": "application/json"},
        body: JSON.stringify({title: title, description: description, status: status}),
        method: "PUT"
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Updating failed");
        })
        .catch(function (err) {
            console.log(err);
        });
}