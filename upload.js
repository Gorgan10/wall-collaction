function formatBytes(bytes) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'Kb', 'Mb', 'Gb']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed())} ${sizes[i]}`
} /// stackoverflow

const element = (tag, classes = [], content) => {
    const node = document.createElement(tag)

    if(classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content
    }

    return node
}

function noop() {}

export function upload(selector, options = {}) {
    let files = []
    const onUpload = options.onUpload ?? noop
    const input = document.querySelector(selector) // select our input
    const preview = element('div', ['preview'])
    const openBtn = element('button', ['btn'], 'Open')
    const uploadBtn = element('button', ['btn', 'primary'], 'Upload')
    uploadBtn.style.display = 'none'

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', uploadBtn)
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
        uploadBtn.style.display = 'inline'

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

        if(!files.length) {
            uploadBtn.style.display = 'none'
        }

        const block = preview // finding current element in DOM
            .querySelector(`[data-name="${name}"]`)
            .closest('.preview-image') // parent element

        block.classList.add('removing')
        setTimeout(() => {
            block.remove()
        }, 300)
    }

    const clearPreview = el => {
        el.style.bottom = '0'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }

    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove()) // removing all elements with '.preview-remove' class
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)
        onUpload(files, previewInfo)
    }

    openBtn.addEventListener('click', triggerInput)
    input.addEventListener('change', changeHandler)
    preview.addEventListener('click', removeHandler) // getting current clicked target
    uploadBtn.addEventListener('click', uploadHandler)
}