let ready = () => {
    console.log('DOM está listo')
    getData()
}

let loaded = () => {
    let myform = document.getElementById('form');
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();
        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;
        if (emailText.length === 0) {
            emailElement.focus()
            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            )
            return
        }
        sendData()
    })

}

const databaseURL = "https://landing-9ec6e-default-rtdb.firebaseio.com/LuxuryVault.json"

const sendData = () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })
    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces');
            form.reset()
            getData()
        })
        .catch(error => {
            alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
        });
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)

let getData = async () => {
    try {
        const response = await fetch(databaseURL, {
            method: 'GET'
        });

        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto tio!');
        }

        const data = await response.json();

        if (data != null) {

            let index = 1;
            let countSubs = new Map()
            let subscribers = document.getElementById('subscribers');

            if (Object.keys(data).length > 0) {

                for (let key in data) {
                    let { email, saved } = data[key]

                    let date = saved.split(",")[0]

                    let count = countSubs.get(date) || 0;

                    countSubs.set(date, count + 1)

                }
            }

            if (countSubs.size > 0) {

                subscribers.innerHTML = ''

                let index = 1;
                for (let [date, count] of countSubs) {
                    let rowTemplate = `
                    <tr>
                        <th>${index}</th>
                        <td>${date}</td>
                        <td>${count}</td>
                    </tr>`
                    subscribers.innerHTML += rowTemplate
                    index++;
                }
            }

        }
    } catch (error) {
        // Muestra cualquier error que ocurra durante la petición
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    }
}