async function filesList(path) {
    let filesraw;
    let table = document.getElementById('fileTable');
    let tbody = document.createElement('tbody');
    let currdir;
    table.innerHTML = '';
    try {
        if (path == '') {
            filesraw = await fetch('http://localhost:4000/files')
        } else if (path == "..") {
            filesraw = await fetch('http://localhost:4000/back');
            console.log('Moving back..');
        } else {
            filesraw = await fetch('http://localhost:4000/files/' + path)
            console.log('path = ' + path);
        }
        let files = await filesraw.json();
        if (files) {
            files.forEach((file, ind) => {
                if (ind === 0) currdir = file.directory;

                console.log("Current directory: " + currdir);
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                if (file.type == 'Directory') {
                    td.innerHTML = `<i class = 'far fa-folder' onclick ="filesList('${file.name}')" style="color:blue"> ${file.name}</i>`;
                } else if (file.type = 'File') {
                    td.innerHTML = `<i class = 'far fa-file'> ${file.name}</i>`;
                }
                tr.append(td);
                tbody.append(tr);
                table.append(tbody);
            })
        } else {
            console.log("Error reading the files");
        }
    } catch (error) {
        console.log('Error :' + error);
    }
}

filesList('');

async function addFile() {
    let raw = await fetch('http://localhost:4000/addfile');
    let files = await raw.json();
    filesList('');
}