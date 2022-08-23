document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/dogs')
    .then(result => result.json())
    .then(data => {
        console.log(data)
        const domDogsTable = document.getElementById('table-body')
        domDogsTable.style.tableLayout = "auto"

        for(dog of data){
            const domDog = document.createElement('tr')
            domDog.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td style="display:flex; justify-content: center"><button>Edit</button></td>`

            domDogsTable.append(domDog)
        }
        console.log(domDogsTable)

    })
})