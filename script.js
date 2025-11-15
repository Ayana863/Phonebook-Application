// fetch API URL
const apiUrl = 'https://691845de21a96359486f857a.mockapi.io/phonebooks'

// get elements from HTML
const phonebookForm = document.getElementById('form')
const displayData = document.getElementById('displayData')
const searchInput = document.getElementById('searchInput')

let allContacts = []
let editId = null

// Function to handle Add or Update 
phonebookForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const nameValue = document.getElementById('name').value.trim()
    const phoneValue = document.getElementById('phoneno').value.trim()

    if (!nameValue || !phoneValue) {
        alert("Please complete all fields")
        return
    }

    // Regular expression for  phonenumber
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phoneValue)) {
        alert("Phone number must be 10 digits")
        return
    }

    // create contact object
    const contact = {
        name: nameValue,
        phonenumber: phoneValue
    }

    try {
        if (editId) {
            // Update existing contact = (put:method)
            await fetch(`${apiUrl}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            })
            editId = null
        } else {
            // Add new contact = (post:method)
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contact)
            })
            if (!response.ok) {
                alert("Failed to add contact")
            }
        }

        // reset form fields
        phonebookForm.reset()
        getContacts()
    } catch (error) {
        console.log(error)
    }
})

//  to get all contacts from API
const getContacts = async () => {
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        allContacts = data
        displayContacts(allContacts)
    } catch (error) {
       console.log(error);
       
    }
}

//  to display contacts 
const displayContacts = (contacts) => {
    displayData.innerHTML = ''
    contacts.forEach(contact => {
        const TabRow = document.createElement('tr')

        TabRow.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.phonenumber}</td>
            <td>
                <button class="updateBtn btn btn-warning">Update</button>
                <button class="deleteBtn btn btn-danger">Delete</button>
            </td>
        `

        // handle Update button click
        TabRow.querySelector('.updateBtn').addEventListener('click', () => {
            document.getElementById('name').value = contact.name
            document.getElementById('phoneno').value = contact.phonenumber
            editId = contact.id
        })

        // handle Delete button click 
        TabRow.querySelector('.deleteBtn').addEventListener('click', async () => {
            const confirmDelete = confirm("Do you want delete this contact?")
            // confirmation ? yes or no
            if (!confirmDelete) {
                return
            }

            try {
                const response = await fetch(`${apiUrl}/${contact.id}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    getContacts()
                } 
            } catch (error) {
                console.log(error)
                
            }
        })

        displayData.appendChild(TabRow)
    })
}

// search contacts by name or phone number
searchInput.addEventListener('input', () => {
    const userType = searchInput.value.toLowerCase()
    const filtered = allContacts.filter(contact =>
        contact.name.toLowerCase().includes(userType) || contact.phonenumber.includes(userType)
    )
    displayContacts(filtered)
})
getContacts()

