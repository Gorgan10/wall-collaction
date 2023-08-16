function formatBytes(bytes) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed())} ${sizes[i]}`
} /// stackoverflow

export function upload(selector, options = {}) {
    let files = []

    const input = document.querySelector(selector) // select our input
    const preview = document.createElement('div')

    preview.classList.add('preview')

    const openBtn = document.createElement('button') // create button
    openBtn.classList.add('btn') // customization our button
    openBtn.textContent = 'Open' // customization our button
    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', openBtn)

    if (options.multi) {
        input.setAttribute('multiple', true) // set attribute to true
    }

    if(options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(',')) // set attribute for filtering the accept array
    }

    const triggerInput = () => input.click()
    const changeHandler = event => {
        if (!event.target.files.length) { // test
            return
        }

        files = Array.from(event.target.files) // Array.from - create array

        preview.innerHTML = '' // clear the preview div

        files.forEach(file => {
            if (!file.type.match('image')) { // test
                return
            }

            const reader = new FileReader()
            reader.onload = ev => {
                const src = ev.target.result
                preview.insertAdjacentHTML('afterbegin', `  
                    <div class="preview-image"">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${src}" alt="${file.name}"/>
                        <div class="preview-info">
                            <span>${file.name}</span>
                            ${formatBytes(file.size)}
                        </div>
                    </div>
                `)
            }// *afterbegin - inside preview

            reader.readAsDataURL(file)
        })

    }

    const removeHandler = event => {
        // getting current clicked target
        if (!event.target.dataset.name) {
            return
        }

        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)

        const block = preview // finding current element in DOM
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image') // parent element

        block.classList.add('removing')
        setTimeout(() => {
            block.remove()
        }, 300)
    }

    openBtn.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler) // getting current clicked target
}