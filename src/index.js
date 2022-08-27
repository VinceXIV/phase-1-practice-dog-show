document.addEventListener('DOMContentLoaded', () => {
    let dogsOnDataBase= {}
    function getDogByName(dogName){
        return dogsOnDataBase.find(dogOnDatabase =>{
            return dogOnDatabase.name === dogName
        })
    }

    function getDogByBreed(dogBreed){
        return dogsOnDataBase.find(dogOnDatabase =>{
            return dogOnDatabase.breed === dogBreed
        })
    }

    function getDogBySex(dogSex){
        return dogsOnDataBase.find(dogOnDatabase =>{
            return dogOnDatabase.sex === dogSex
        })
    }
    
    //Populate the dom with registered dogs

    function createDomEntries(data){
        const domDogsTable = document.getElementById('table-body')
        domDogsTable.innerHTML = ''
        domDogsTable.style.tableLayout = "auto"

        for(dog of data){
            const domDog = document.createElement('tr')
            domDog.id = dog.id
            domDog.innerHTML = `
                <td class="dog-name">${dog.name}</td>
                <td class="dog-breed">${dog.breed}</td>
                <td class="dog-sex">${dog.sex}</td>
                <td style="display:flex; justify-content: center" class="add-dog-button"><button>Edit Dog</button></td>`

            domDogsTable.append(domDog)

            addEventListenerToButton(domDog)
        }

        dogsOnDataBase = data
    }

    function addEventListenerToButton(domDog){
        domDog.querySelector('.add-dog-button')
        .addEventListener('click', e =>{
            console.log(domDog)
            const domDogForm = document.getElementById('dog-form')

            domDogForm.elements[name = "name"].value = domDog.querySelector('.dog-name').textContent
            domDogForm.elements[name = "breed"].value = domDog.querySelector('.dog-breed').textContent
            domDogForm.elements[name = "sex"].value = domDog.querySelector('.dog-sex').textContent  

        })
    }

    function updateDomEntries(data){
        console.log("data", data)
        const domDogEntries = document.getElementById('table-body')
        const domDogList = domDogEntries.querySelectorAll('tr')
        const itemId = `${data.id}`
        
        let entryToModify = Array.from(domDogList).find(item => {
            return item.id == itemId
        })

        console.log("entry to modify: ", entryToModify)

        if(entryToModify){
            entryToModify.innerHTML = `
                <td class="dog-name">${data.name}</td>
                <td class="dog-breed">${data.breed}</td>
                <td class="dog-sex">${data.sex}</td>
                <td style="display:flex; justify-content: center"><button>Edit Dog</button></td>`
        }
    }


    function updateOurDogsOnDatabaseCopy(data){
        let entryToModify =  dogsOnDataBase.find(item =>{
            return item.id == data.id
        })

        entryToModify.name = data.name
        entryToModify.breed = data.breed
        entryToModify.sex = data.sex
    }

    fetch('http://localhost:3000/dogs')
    .then(result => result.json())
    .then(data => {
        createDomEntries(data)
    })


    //Edit existing dog
    const domDogForm = document.getElementById('dog-form')

    domDogForm.addEventListener('keyup', handleEditDogForm)
    function handleEditDogForm(){
        populateEmptyEntries()
        removeEventListenerOnBackspace()
    }

    // Populate empty entries with values in the database. For instance, if one writes the name of the dog
    // this name will be searched in existing values so that the rest of the fields will be filled with
    // existing values. If one decides to change them, this will be handled by the removeEventListenerOnBackspace()
    // function. Read details on the function to see how this is done
    function populateEmptyEntries(){
        const dogInfo = getDogByName(domDogForm.elements[name = "name"].value)
        || getDogByBreed(domDogForm.elements[name = "breed"].value)
        || getDogBySex(domDogForm.elements[name = "sex"].value)

        if(dogInfo){
            domDogForm.elements[name = "name"].value = domDogForm.elements[name = "name"].value || dogInfo.name
            domDogForm.elements[name = "breed"].value = domDogForm.elements[name = "breed"].value || dogInfo.breed
            domDogForm.elements[name = "sex"].value = domDogForm.elements[name = "sex"].value || dogInfo.sex           
        }
    }

    // Here, when a user clicks the backspace on eny of the entries, it is assumed that it is the entry they want
    // to change such that its value is not the default as is currently existing in the database. Thus, the event
    // listener for "keyup" is removed to prevent the value from being filled again to the original value once
    // a user deletes everything in that entry
    function removeEventListenerOnBackspace(){
        Array.from(domDogForm.elements).forEach(
            domInput =>{
                domInput.addEventListener('keydown', e =>{
                    if(e.key === 'Backspace'){
                        domDogForm.removeEventListener('keyup', handleEditDogForm)
                    }
                })
            }
        )
    }

    domDogForm.addEventListener('submit', e=>{
        e.preventDefault()

        //Make sure that empty entries imply that those values will not be changed
        //in the database to empty
        const dogInfo = getDogByName(domDogForm.elements[name = "name"].value)
                        || getDogByBreed(domDogForm.elements[name = "breed"].value)
                        || getDogBySex(domDogForm.elements[name = "sex"].value)
        if(dogInfo){
            const dogId = dogInfo.id
            const dogName = domDogForm.elements[name = "name"].value || dogInfo.name
            const dogBreed = domDogForm.elements[name = "breed"].value || dogInfo.breed
            const dogSex = domDogForm.elements[name = "sex"].value || dogInfo.sex

            fetch(`http://localhost:3000/dogs/${dogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name: dogName,
                        breed: dogBreed,
                        sex: dogSex
                    }
                )
            })
            .then(result => result.json())
            .then(data => {
                updateDomEntries(data)
                updateOurDogsOnDatabaseCopy(data)
            })
        }
        e.target.reset()
    })
})