console.log("Main Script Loaded")

const closeSideBar = document.querySelector('.closeSideBar')
const sideBar = document.querySelector('.sideBar')

closeSideBar.addEventListener('click', () => {
    if (closeSideBar.classList.contains('open')) {
        sideBar.classList.remove('open')
        sideBar.classList.add('close')

        closeSideBar.classList.remove('open')
        closeSideBar.classList.add('close')
    } else {
        sideBar.classList.remove('close')
        sideBar.classList.add('open')

        closeSideBar.classList.remove('close')
        closeSideBar.classList.add('open')
    }
})

document.querySelector('.search_bar').addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        e.preventDefault()
        document.querySelector('.searchBtn').click()
    }
})