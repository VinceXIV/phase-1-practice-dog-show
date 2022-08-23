document.addEventListener('DOMContentLoaded', () => {
    const dogNamesAndIds = {}
    function getDogId(dog){
        for(dogName in dogNamesAndIds){
            if(dogName === dog){
                return dogNamesAndIds[dogName]
            }
        }
    }
    
    //Populate the dom with registered dogs

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

            dogNamesAndIds[dog.name] = dog.id
        }
        console.log(domDogsTable)

    })


    //Edit existing dog
})