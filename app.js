import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { upload } from './upload.js'

const firebaseConfig = {
    apiKey: "AIzaSyDnwcUXoLq6y__vijA83KQAF4pAFSsUmJY",
    authDomain: "wall-collection-7c30e.firebaseapp.com",
    projectId: "wall-collection-7c30e",
    storageBucket: "wall-collection-7c30e.appspot.com",
    messagingSenderId: "1035525511805",
    appId: "1:1035525511805:web:2449cedd5ead7cbf1b6f14"
}
const app = initializeApp(firebaseConfig)
const storage = getStorage(app);

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const storageRef = ref(storage,`images/${file.name}`) // upload files to path
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    console.log('File available at', downloadURL);
                })
            })
        })
    }
})